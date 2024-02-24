const dotenv = require("dotenv");
dotenv.config();
("use strict");
console.log(process.env.PROD.toUpperCase() === "PROD"
    ? "prod"
    : process.env.PROD.toUpperCase() === "DEV"
        ? "dev"
        : "local");
const config = {
    app_name: process.env.PROD.toUpperCase() === "PROD"
        ? "prod"
        : process.env.PROD.toUpperCase() === "DEV"
            ? "dev"
            : "local",
    license_key: process.env.NEW_RELIC_LICENSE_KEY,
    logging: {
        level: "info",
    },
    allow_all_headers: true,
    attributes: {
        exclude: [
        //         "request.headers.cookie",
        //         "request.headers.authorization",
        //         "request.headers.proxyAuthorization",
        //         "request.headers.setCookie*",
        //         "request.headers.x*",
        //         "response.headers.cookie",
        //         "response.headers.authorization",
        //         "response.headers.proxyAuthorization",
        //         "response.headers.setCookie*",
        //         "response.headers.x*",
        ],
    },
};
module.exports = { config };
