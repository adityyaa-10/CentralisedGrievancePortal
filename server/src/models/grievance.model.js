import mongoose, { Schema } from "mongoose";

const grievanceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    grievance: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false  // false for "pending", true for "solved"
    }
}, {
    timestamps: true
});

export const Grievance = mongoose.model('Grievance', grievanceSchema);