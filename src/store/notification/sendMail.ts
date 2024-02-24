import * as nodemailer from "nodemailer";
import * as fs from "fs";

const sourceEmail = process.env.nodemailer_user_email;
const sourcePassword = process.env.nodemailer_user_password;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: sourceEmail, pass: sourcePassword },
});

export function replaceTemplate(
    template: string,
    content: { [key: string]: string }
): string {
    return Object.keys(content).reduce(
        (output, key) =>
            output.replace(new RegExp(`{{ ${key} }}`, "g"), content[key]),
        template
    );
}

export const sendEmail = async ({
    body,
    destination,
    subject,
}: {
    body: string;
    destination: string[];
    subject: string;
}): Promise<void> => {
    try {
        for (let i = 0; i < destination.length; i++) {
            const mailOptions = {
                from: sourceEmail,
                to: destination[i],
                subject: subject,
                html: body,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log({
                message: `Email sent ${destination[i]}`,
                info: info.response,
            });
        }
    } catch (error) {
        console.error({ message: "Error sending email", error });
    }
};
