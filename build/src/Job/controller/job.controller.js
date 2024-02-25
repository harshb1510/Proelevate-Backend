"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const responseCode_enum_1 = require("../../store/enums/HTTP_Response_Code/responseCode.enum");
const job_helper_1 = require("../helper/job.helper");
const pino_1 = require("../../store/logger/pino");
class JobController {
    static createJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobData = req.body;
                const job = yield job_helper_1.JobHelper.createJob(jobData);
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.CREATED_OK).json(job);
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
    static getJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const job = yield job_helper_1.JobHelper.getJob(jobId);
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(job);
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
    static updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const jobData = req.body;
                const updatedJob = yield job_helper_1.JobHelper.updateJob(jobId, jobData);
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(updatedJob);
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
    static deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                yield job_helper_1.JobHelper.deleteJob(jobId);
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json({ message: "Job deleted successfully" });
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
    static addUserToJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const userId = req.body.userId;
                const job = yield job_helper_1.JobHelper.addUserToJob(jobId, userId);
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.OK).json(job);
            }
            catch (error) {
                return res.status(responseCode_enum_1.EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
            }
        });
    }
}
exports.JobController = JobController;
__decorate([
    (0, pino_1.LogRequestResponse)()
], JobController, "createJob", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], JobController, "getJob", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], JobController, "updateJob", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], JobController, "deleteJob", null);
__decorate([
    (0, pino_1.LogRequestResponse)()
], JobController, "addUserToJob", null);
