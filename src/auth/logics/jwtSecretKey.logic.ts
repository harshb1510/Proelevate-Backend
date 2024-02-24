import crypto from "crypto";

// Generate a random 256-bit (6-byte) secret key
// const secretKey = crypto.randomBytes(32).toString('hex');

// console.log('JWT Secret Key:', secretKey);


export function generate32BitToken(){
    return crypto.randomBytes(32).toString('hex');
}