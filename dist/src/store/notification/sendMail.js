"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.sendEmail = exports.replaceTemplate = void 0;
const nodemailer = __importStar(require("nodemailer"));
const sourceEmail = process.env.nodemailer_user_email;
const sourcePassword = process.env.nodemailer_user_password;
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: sourceEmail, pass: sourcePassword },
});
function replaceTemplate(template, content) {
    return Object.keys(content).reduce((output, key) => output.replace(new RegExp(`{{ ${key} }}`, "g"), content[key]), template);
}
exports.replaceTemplate = replaceTemplate;
const sendEmail = ({ body, destination, subject, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < destination.length; i++) {
            const mailOptions = {
                from: sourceEmail,
                to: destination[i],
                subject: subject,
                html: body,
            };
            const info = yield transporter.sendMail(mailOptions);
            console.log({
                message: `Email sent ${destination[i]}`,
                info: info.response,
            });
        }
    }
    catch (error) {
        console.error({ message: "Error sending email", error });
    }
});
exports.sendEmail = sendEmail;
