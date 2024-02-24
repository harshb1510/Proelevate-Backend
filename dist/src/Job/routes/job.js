"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.job_routes = void 0;
const express_1 = __importDefault(require("express"));
const job_controller_1 = require("../controller/job.controller");
exports.job_routes = express_1.default.Router();
exports.job_routes.post('/create', job_controller_1.JobController.createJob);
exports.job_routes.get('/getJobs/:id', job_controller_1.JobController.getJob);
exports.job_routes.put('/updateJobs/:id', job_controller_1.JobController.updateJob);
exports.job_routes.delete('/deleteJobs/:id', job_controller_1.JobController.deleteJob);
exports.job_routes.put('/jobs/:id/addUser', job_controller_1.JobController.addUserToJob);
