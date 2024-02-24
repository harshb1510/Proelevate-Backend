import bcrypt from "bcrypt";
import { CustomError } from "../../store/error/customError";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";

export class UpdateUserQueryBuilder{

    private data: {  password: string | Buffer;};
    private user: {  password: string; createdAt: string | number | Date; updatedAt: string | number };

    constructor(data, user){
        this.data = data;
        this.user = user;
    }


    setPassword(){
        if(this.data.password){
            this.user.password = bcrypt.hashSync(this.data.password, 10);
        }

        return this;
    }

    getQuery(){
        return this.user;
    }
}