const mongoose = require("mongoose");


// ==========================================
// Technical Question
// ==========================================

const technicalQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Technical question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, {
    _id: false
});


// ==========================================
// Behavioral Question
// ==========================================

const behavioralQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Behavioral question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, {
    _id: false
});


// ==========================================
// Skill Gap
// ==========================================

const skillGapSchema = new mongoose.Schema({

    skill: {
        type: String,
        required: [true, "Skill is required"]
    },

    severity: {
        type: String,

        enum: ["low", "medium", "high"],

        required: [true, "Severity is required"]
    }

}, {
    _id: false
});


// ==========================================
// Preparation Plan
// ==========================================

const preparationPlanSchema = new mongoose.Schema({

    day: {
        type: Number,
        required: [true, "Day is required"]
    },

    focus: {
        type: String,
        required: [true, "Focus is required"]
    },

    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]

}, {
    _id: false
});


// ==========================================
// Interview Report
// ==========================================

const interviewReportSchema = new mongoose.Schema({

    // Job Title
    jobTitle: {
        type: String,
        required: [true, "Job title is required"]
    },


    // Job Description
    jobDescription: {
        type: String,

        required: [
            true,
            "Job description is required"
        ]
    },


    // Self Description
    selfDescription: {
        type: String,

        required: [
            true,
            "Self description is required"
        ]
    },


    // Resume
    resume: {
        type: String
    },


    // Match Score
    matchScore: {
        type: Number,

        min: 0,

        max: 100
    },


    // Technical Questions
    technicalQuestions: [
        technicalQuestionSchema
    ],


    // Behavioral Questions
    behavioralQuestions: [
        behavioralQuestionSchema
    ],


    // Preparation Plan
    preparationPlan: [
        preparationPlanSchema
    ],


    // Skill Gaps
    skillGaps: [
        skillGapSchema
    ],


    // User
    user: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true
    }

}, {
    timestamps: true
});


const interviewReportModel =
    mongoose.model(
        "InterviewReport",
        interviewReportSchema
    );


module.exports = interviewReportModel;