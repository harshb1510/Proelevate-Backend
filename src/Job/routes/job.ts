import express from "express";
import { JobController } from "../controller/job.controller";


export const job_routes = express.Router();

job_routes.post(
    '/jobs',
    JobController.createJob
)

job_routes.get(
    '/jobs/:id',
    JobController.getJob
)

job_routes.put(
    '/jobs/:id',
    JobController.updateJob
)

job_routes.delete(
    '/jobs/:id',
    JobController.deleteJob
)

job_routes.put(
    '/jobs/:id/addUser',
    JobController.addUserToJob
)
