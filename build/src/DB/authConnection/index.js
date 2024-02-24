"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthDbConnection = void 0;
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_model_1 = require("../../store/models/auth.model");
dotenv.config();
class DBConnection {
    constructor() {
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new DBConnection();
            this.instance.initializeConnection();
        }
        return this.instance;
    }
    async initializeConnection() {
        try {
            console.log("Establishing Auth Database connection");
            this.authDatabase = mongoose_1.default.createConnection(process.env.DB_URI);
            console.log("🟢 Connected to Auth DB!");
            this.authDBModels = (0, auth_model_1.createAuthDBModels)(this.authDatabase);
        }
        catch (error) {
            console.log("🔴 MONGODB_CLIENT closed: ", error.message);
        }
    }
    getDBModels() {
        return this.authDBModels;
    }
}
const createAuthDbConnection = () => {
    const dbConnection = DBConnection.getInstance();
    const authDBModels = dbConnection.getDBModels();
    return authDBModels ? { success: true, authDBModels: authDBModels } : { success: false, };
};
exports.createAuthDbConnection = createAuthDbConnection;
