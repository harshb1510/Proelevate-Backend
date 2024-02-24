import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { createAuthDBModels } from "../../store/models/auth.model";

dotenv.config();

class DBConnection {
    private static instance: DBConnection;
    private authDatabase: mongoose.Connection;
    private authDBModels;

    private constructor() {
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new DBConnection();
            this.instance.initializeConnection();
        }
        return this.instance;
    }

    private async initializeConnection() {
        try {
            console.log("Establishing Auth Database connection");
            this.authDatabase = mongoose.createConnection(process.env.DB_URI);
            console.log("🟢 Connected to Auth DB!");

            this.authDBModels = createAuthDBModels(this.authDatabase);
        } catch (error) {
            console.log("🔴 MONGODB_CLIENT closed: ", error.message);
        }
    }

    public getDBModels() {
        return this.authDBModels;
    }
}

export const createAuthDbConnection = () => {
    const dbConnection = DBConnection.getInstance();
    const authDBModels = dbConnection.getDBModels();

    return authDBModels ? { success: true, authDBModels: authDBModels } : { success: false,  };
};
