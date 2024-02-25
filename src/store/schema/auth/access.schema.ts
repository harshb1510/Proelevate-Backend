import mongoose from "mongoose";

export const accessSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
}, {
    timestamps: true
});
