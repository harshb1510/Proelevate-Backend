import mongoose from "mongoose";

export class UserInfoFetchBuilder {

    private query: Object = {};
    constructor() {
    }

    addEmail(emailId){
        if(emailId){
            this.query['emailId'] = emailId;
        }

        return this;
    }

    addId(_id: string){
        if(_id){
            this.query['_id'] = new mongoose.Types.ObjectId(_id.toString());
        }

        return this;
    }



    buildQuery(){
        return this.query
    }
}