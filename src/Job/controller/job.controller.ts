// job.controller.ts
import { Request, Response } from "express";
import { IJob } from "../../store/interfaces/job/job.interface";
import { EHTTPS_RESPONSE_CODE } from "../../store/enums/HTTP_Response_Code/responseCode.enum";
import { JobHelper } from "../helper/job.helper";
import { LogRequestResponse } from "../../store/logger/pino";

export class JobController {
    @LogRequestResponse()
    static async createJob(req: Request, res: Response) {
        try {
            const jobData: IJob = req.body;
            const job: IJob = await JobHelper.createJob(jobData);
            return res.status(EHTTPS_RESPONSE_CODE.CREATED_OK).json(job);
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }

    @LogRequestResponse()
    static async getJob(req: Request, res: Response) {
        try {
            const jobId: string = req.params.id;
            const job: IJob = await JobHelper.getJob(jobId);
            return res.status(EHTTPS_RESPONSE_CODE.OK).json(job);
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }

    @LogRequestResponse()
    static async updateJob(req: Request, res: Response) {
        try {
            const jobId: string = req.params.id;
            const jobData: Partial<IJob> = req.body;
            const updatedJob: IJob = await JobHelper.updateJob(jobId, jobData);
            return res.status(EHTTPS_RESPONSE_CODE.OK).json(updatedJob);
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }

    @LogRequestResponse()
    static async deleteJob(req: Request, res: Response) {
        try {
            const jobId: string = req.params.id;
            await JobHelper.deleteJob(jobId);
            return res.status(EHTTPS_RESPONSE_CODE.OK).json({ message: "Job deleted successfully" });
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }

    @LogRequestResponse()
    static async addUserToJob(req: Request, res: Response) {
        try {
            const jobId: string = req.params.id;
            const userId: string = req.body.userId;
            const { job, message } = await JobHelper.addUserToJob(jobId, userId);
            return res.status(EHTTPS_RESPONSE_CODE.OK).json({ job, message });
        } catch (error) {
            return res.status(EHTTPS_RESPONSE_CODE.SERVER_ERROR).json({ error: error.message });
        }
    }    
}
