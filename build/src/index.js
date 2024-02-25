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
require("newrelic");
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = require("./routes");
dotenv.config();
class Server {
    constructor() {
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            this.server = (0, express_1.default)();
            this.middleware();
            yield this.connectDB();
            this.configRoutes();
            this.start();
        });
        this.configRoutes = () => {
            this.routes = routes_1.routes;
            this.routes.map((route) => {
                if (!route.middleware)
                    return this.server.use(route.path, route.router);
                return this.server.use(route.path, route.middleware, route.router);
            });
        };
        this.start = () => {
            this.server.listen(process.env.PORT || 3000, () => {
                console.log(`🟢 Server is running on port ${process.env.PORT || 3001} 🎉`);
            });
            this.server.get("/", (req, res) => {
                res.send("Hello!! WELCOME");
            });
        };
        this.init();
    }
    middleware() {
        this.server.use((0, helmet_1.default)());
        this.server.use((0, cors_1.default)());
        this.server.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
        });
        // this.server.use(express.json());
        this.server.use(express_1.default.json({ limit: "50mb" }));
        this.server.use(express_1.default.urlencoded({ extended: false, limit: "50mb" }));
    }
    connectDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (process.env.DB_URI) {
                    yield mongoose_1.default.connect(process.env.DB_URI);
                    const db = mongoose_1.default.connection;
                    if (mongoose_1.default.connection.readyState) {
                        console.log("🟢 Connected to MongoDB");
                    }
                    db.on("error", (error) => {
                        console.error("🔴 MongoDB connection error:", error);
                    });
                    db.once("open", () => {
                        console.log("🟢 Connected to MongoDB");
                    });
                }
                else {
                    throw new Error("DB_URI missing");
                }
            }
            catch (e) {
                console.log("🔴 Failed to connect to DB");
            }
        });
    }
}
exports.default = new Server().server;
