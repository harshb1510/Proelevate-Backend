"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobHelper = void 0;
const job_model_1 = require("../../store/models/job.model");
class JobHelper {
    static async createJob(jobData) {
        try {
            const job = await job_model_1.JobModel.create(jobData);
            return job;
        }
        catch (error) {
            throw error;
        }
    }
    static async getJob(jobId) {
        try {
            const job = await job_model_1.JobModel.findById(jobId);
            if (!job) {
                throw new Error("Job not found");
            }
            return job;
        }
        catch (error) {
            throw error;
        }
    }
    static async updateJob(jobId, jobData) {
        try {
            const job = await job_model_1.JobModel.findByIdAndUpdate(jobId, jobData, { new: true });
            if (!job) {
                throw new Error("Job not found");
            }
            return job;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteJob(jobId) {
        try {
            await job_model_1.JobModel.findByIdAndDelete(jobId);
        }
        catch (error) {
            throw error;
        }
    }
    static async addUserToJob(jobId, userId) {
        try {
            const job = await job_model_1.JobModel.findByIdAndUpdate(jobId, { $push: { usersApplied: userId } }, { new: true });
            if (!job) {
                throw new Error("Job not found");
            }
            return job;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.JobHelper = JobHelper;
