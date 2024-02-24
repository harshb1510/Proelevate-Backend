"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_1 = require("../auth/routes/auth");
const job_1 = require("../Job/routes/job");
exports.routes = [
    {
        path: "/v1/auth",
        router: auth_1.auth_routes,
    },
    {
        path: "/v1/job",
        router: job_1.job_routes,
    },
];
