import express from "express";
import { JobController } from "../controller/job.controller";


export const job_routes = express.Router();

job_routes.post(
    '/create',
    JobController.createJob
)

job_routes.get(
    '/getJobs/:id',
    JobController.getJob
)

job_routes.put(
    '/updateJobs/:id',
    JobController.updateJob
)

job_routes.delete(
    '/deleteJobs/:id',
    JobController.deleteJob
)

job_routes.put(
    '/jobs/:id/addUser',
    JobController.addUserToJob
)
