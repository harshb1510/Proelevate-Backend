import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export class AxiosService {
    async utilCallAxios(reqBody: {
        constructor: Function;
        METHOD: any;
        URL: any;
        headers: any;
        ENDPOINT: any;
        method: any;
        url: any;
        data: any;
    }): Promise<any> {
        if (
            reqBody.constructor != {}.constructor ||
            !reqBody.METHOD ||
            !reqBody.URL
        ) {
            return {
                err: true,
                errMessage:
                    "param must be an object to utilCallAxios and method and url are mandatory",
            };
        }

        if (!reqBody.headers) {
            reqBody.headers = {};
        } else {
            if (reqBody.headers.constructor != {}.constructor) {
                return {
                    err: true,
                    errMessage:
                        "headers recieved in utilAxios must be of type object",
                };
            }
        }

        let returnObj = {};
        let formattedUrl = reqBody.URL + reqBody.ENDPOINT;

        console.log("\nCalling api", formattedUrl);

        if (formattedUrl.length > 200) {
            formattedUrl = formattedUrl.substring(0, 200) + "...";
        }

        let finTime = 0;
        let initTime = Date.now();

        try {
            let res = await axios({
                method: reqBody.method,
                url: reqBody.url,
                headers: reqBody.headers,
                data: reqBody.data,
            });

            finTime = Date.now();

            if (res && res.data) {
                returnObj = {
                    data: res.data,
                    status: res.status,
                };
            } else {
                returnObj = {
                    data: "",
                    status: res.status,
                };
            }

            return returnObj;
        } catch (error) {
            finTime = Date.now();
            returnObj = {
                err: true,
                errMessage:
                    error && error.response && error.response.data
                        ? error.response.data
                        : error,
                status:
                    error && error.response && error.response.status
                        ? error.response.status
                        : undefined,
            };

            return returnObj;
        }
    }
}
