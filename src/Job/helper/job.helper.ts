// job.helper.ts
import { IJob } from "../../store/interfaces/job/job.interface";
import { JobModel } from "../../store/models/job.model";

export class JobHelper {
    static async createJob(jobData: IJob): Promise<IJob> {
        try {
            const job: IJob = await JobModel.create(jobData);
            return job;
        } catch (error) {
            throw error;
        }
    }

    static async getJob(jobId: string): Promise<IJob> {
        try {
            const job: IJob = await JobModel.findById(jobId);
            if (!job) {
                throw new Error("Job not found");
            }
            return job;
        } catch (error) {
            throw error;
        }
    }

    static async updateJob(jobId: string, jobData: Partial<IJob>): Promise<IJob> {
        try {
            const job: IJob = await JobModel.findByIdAndUpdate(jobId, jobData, { new: true });
            if (!job) {
                throw new Error("Job not found");
            }
            return job;
        } catch (error) {
            throw error;
        }
    }

    static async deleteJob(jobId: string): Promise<void> {
        try {
            await JobModel.findByIdAndDelete(jobId);
        } catch (error) {
            throw error;
        }
    }

    static async addUserToJob(jobId: string, userId: string): Promise<IJob> {
        try {
            const job: IJob = await JobModel.findByIdAndUpdate(jobId, { $push: { usersApplied: userId } }, { new: true });
            if (!job) {
                throw new Error("Job not found");
            }
            return job;
        } catch (error) {
            throw error;
        }
    }
}
