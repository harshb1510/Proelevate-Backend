import { auth_routes } from "../auth/routes/auth";
import { job_routes } from "../Job/routes/job";

export const routes = [
    {
        path: "/v1/auth",
        router: auth_routes,
    },
    {
        path: "/v1/job",
        router: job_routes,
    },
];
