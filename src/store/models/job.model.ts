// job.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
    date: Date;
    link: string;
    title: string;
    usersApplied: string[];
}

const JobSchema: Schema = new Schema({
    date: { type: Date, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    usersApplied: [{ type: Schema.Types.ObjectId, ref: 'User' }] 
});

export const JobModel = mongoose.model<IJob>('Job', JobSchema);
