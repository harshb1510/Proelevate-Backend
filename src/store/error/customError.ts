import { EHTTPS_RESPONSE_CODE } from "../enums/HTTP_Response_Code/responseCode.enum";

export class CustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number = EHTTPS_RESPONSE_CODE.SERVER_ERROR) {
      super(message);
      this.statusCode = statusCode;
    }
  }