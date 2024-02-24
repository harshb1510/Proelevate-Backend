import bcrypt from "bcrypt";
import { CustomError } from "../../store/error/customError";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";

export class UpdateUserQueryBuilder{

    private data: { phoneNumber: any; password: string | Buffer; dob: any; };
    private user: { phoneNumber: any; password: string; createdAt: string | number | Date; updatedAt: string | number | Date; dob: any; };

    constructor(data, user){
        this.data = data;
        this.user = user;
    }

    setPhoneNumber(){
        if(this.data.phoneNumber)
            this.user.phoneNumber = this.data.phoneNumber;

        return this;
    }

    setPassword(){
        if(this.data.password){
            this.user.password = bcrypt.hashSync(this.data.password, 10);
        }

        return this;
    }

    setDOB(){
        // update dob if createdAt and updatedAt are same
        if(this.data.dob){
            // if createdAt and updatedAt are different, then dob is changed
            if(new Date(this.user.createdAt)<new Date(this.user.updatedAt)){
                throw new CustomError('User can change dob only once.', EHTTPS_RESPONSE_CODE.UNPROCESSABLE_ENTRY)
            } else {
                // if changing dob, update the timestamp of updatedAt
                this.user.dob = this.data.dob;
                this.user.updatedAt = new Date();
            }
        } else {
            // if dob is not yet modified, maintain the timestamp
            if(new Date(this.user.createdAt)==new Date(this.user.updatedAt)){
                this.user.updatedAt = this.user.createdAt;
            }
        }

        return this;
    }

    getQuery(){
        return this.user;
    }
}