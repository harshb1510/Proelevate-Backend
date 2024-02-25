"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRequestResponse = void 0;
const pino_1 = __importDefault(require("pino"));
const nanoid_1 = require("nanoid");
const baseLogger = (0, pino_1.default)();
function createLoggerWithRequestId(requestID) {
    return baseLogger.child({ requestID });
}
function LogRequestResponse() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const startTimer = process.hrtime();
        descriptor.value = function (...args) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const req = args[0];
                const res = args[1];
                const next = args[2];
                // Generate a unique id for the request
                const requestID = req["requestID"] || (0, nanoid_1.nanoid)();
                req["requestID"] = requestID;
                // Create a child logger for this request
                const logger = createLoggerWithRequestId(requestID.toString());
                // Log the request details
                logger.info({
                    requestID,
                    method: req.method,
                    url: req.url,
                    body: req.body,
                    query: req.query,
                    user: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.emailId) !== null && _b !== void 0 ? _b : null,
                }, `Incoming request ${req.method} ${req.url} traced with requestID: ${requestID}`);
                // Override response methods to capture responseBody and log
                // Override res.send and res.json
                const originalSend = res.send;
                const originalJson = res.json;
                let responseBody;
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
                    var _a, _b, _c, _d;
                    const logData = {
                        requestID: requestID,
                        method: res.req.method,
                        user: (_a = res.req.user) === null || _a === void 0 ? void 0 : _a.emailId,
                        requestData: (_c = (_b = res.req) === null || _b === void 0 ? void 0 : _b.body) !== null && _c !== void 0 ? _c : (_d = res.req) === null || _d === void 0 ? void 0 : _d.query,
                        url: res.req.url,
                        status_code: res.statusCode,
                        time: `${process.hrtime(startTimer)[1] / 1000000} ms`,
                        responseBody: `${responseBody.substring(0, 200)}...`,
                    };
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        logger.info(logData, `Response Data traced with requestID: ${requestID}`);
                    }
                    else if (res.statusCode >= 400 && res.statusCode < 500) {
                        logger.warn(logData, `Warning created in Response with requestID: ${requestID}`);
                    }
                    else if (res.statusCode >= 500) {
                        logger.error(logData, `Error in Response with requestID: ${requestID}`);
                    }
                });
                // Execute the original method
                try {
                    yield originalMethod.apply(this, args);
                }
                catch (error) {
                    logger.error({ requestID, error: error.message }, "Request processing error");
                    next(error);
                }
            });
        };
    };
}
exports.LogRequestResponse = LogRequestResponse;
