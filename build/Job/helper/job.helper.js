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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobHelper = void 0;
const job_model_1 = require("../../store/models/job.model");
class JobHelper {
    static createJob(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield job_model_1.JobModel.create(jobData);
                return job;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield job_model_1.JobModel.findById(jobId);
                if (!job) {
                    throw new Error("Job not found");
                }
                return job;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateJob(jobId, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield job_model_1.JobModel.findByIdAndUpdate(jobId, jobData, { new: true });
                if (!job) {
                    throw new Error("Job not found");
                }
                return job;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield job_model_1.JobModel.findByIdAndDelete(jobId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static addUserToJob(jobId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = yield job_model_1.JobModel.findByIdAndUpdate(jobId, { $push: { usersApplied: userId } }, { new: true });
                if (!job) {
                    throw new Error("Job not found");
                }
                return job;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.JobHelper = JobHelper;
