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
exports.AxiosService = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class AxiosService {
    utilCallAxios(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reqBody.constructor != {}.constructor ||
                !reqBody.METHOD ||
                !reqBody.URL) {
                return {
                    err: true,
                    errMessage: "param must be an object to utilCallAxios and method and url are mandatory",
                };
            }
            if (!reqBody.headers) {
                reqBody.headers = {};
            }
            else {
                if (reqBody.headers.constructor != {}.constructor) {
                    return {
                        err: true,
                        errMessage: "headers recieved in utilAxios must be of type object",
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
                let res = yield (0, axios_1.default)({
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
                }
                else {
                    returnObj = {
                        data: "",
                        status: res.status,
                    };
                }
                return returnObj;
            }
            catch (error) {
                finTime = Date.now();
                returnObj = {
                    err: true,
                    errMessage: error && error.response && error.response.data
                        ? error.response.data
                        : error,
                    status: error && error.response && error.response.status
                        ? error.response.status
                        : undefined,
                };
                return returnObj;
            }
        });
    }
}
exports.AxiosService = AxiosService;
