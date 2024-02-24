import { Request, Response, NextFunction } from "express";
import pino from "pino";
import { IAuth } from "../interfaces/auth/AuthenticationRequest.interface";
import { nanoid } from "nanoid";

const baseLogger = pino();

function createLoggerWithRequestId(requestID: string) {
    return baseLogger.child({ requestID });
}

export function LogRequestResponse() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const originalMethod = descriptor.value;
        const startTimer = process.hrtime();

        descriptor.value = async function (...args: any[]) {
            const req: Request | IAuth = args[0] as Request | IAuth;
            const res: Response = args[1];
            const next: NextFunction = args[2];

            // Generate a unique id for the request
            const requestID = req["requestID"] || nanoid();
            req["requestID"] = requestID;

            // Create a child logger for this request
            const logger = createLoggerWithRequestId(requestID.toString());

            // Log the request details
            logger.info(
                {
                    requestID,
                    method: req.method,
                    url: req.url,
                    body: req.body,
                    query: req.query,
                    user: (req as IAuth).user?.emailId ?? null,
                },
                `Incoming request ${req.method} ${req.url} traced with requestID: ${requestID}`
            );

            // Override response methods to capture responseBody and log
            // Override res.send and res.json
            const originalSend = res.send;
            const originalJson = res.json;
            let responseBody: any;

            res.send = function (body) {
                responseBody = body;
                return originalSend.apply(this, arguments);
            };

            res.json = function (body) {
                responseBody = body;
                return originalJson.apply(this, arguments);
            };

            // Log response when the response is finished
            res.on("finish", () => {
                const logData = {
                    requestID: requestID,
                    method: res.req.method,
                    user: (res.req as IAuth).user?.emailId,
                    requestData: res.req?.body ?? res.req?.query,
                    url: res.req.url,
                    status_code: res.statusCode,
                    time: `${process.hrtime(startTimer)[1] / 1000000} ms`,
                    responseBody: `${responseBody.substring(0, 200)}...`,
                };
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    logger.info(
                        logData,
                        `Response Data traced with requestID: ${requestID}`
                    );
                } else if (res.statusCode >= 400 && res.statusCode < 500) {
                    logger.warn(
                        logData,
                        `Warning created in Response with requestID: ${requestID}`
                    );
                } else if (res.statusCode >= 500) {
                    logger.error(
                        logData,
                        `Error in Response with requestID: ${requestID}`
                    );
                }
            });

            // Execute the original method
            try {
                await originalMethod.apply(this, args);
            } catch (error: any) {
                logger.error(
                    { requestID, error: error.message },
                    "Request processing error"
                );
                next(error);
            }
        };
    };
}
