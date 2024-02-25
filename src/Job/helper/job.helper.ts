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

    static async addUserToJob(jobId: string, userId: string): Promise<{ job: IJob, message: string }> {
        try {
            const job: IJob = await JobModel.findByIdAndUpdate(
                jobId,
                { $addToSet: { usersApplied: userId } }, // $addToSet ensures that userId is only added if it doesn't already exist in the array
                { new: true }
            );
    
            if (!job) {
                throw new Error("Job not found");
            }
    
            // Check if the user ID already exists in the usersApplied array
            if (job.usersApplied.includes(userId)) {
                // User already applied, return the job as it is along with a message
                return { job, message: "User already applied" };
            }
    
            // Return the updated job along with a message indicating successful application
            return { job, message: "User applied successfully" };
        } catch (error) {
            throw error;
        }
    }
    
    
}
