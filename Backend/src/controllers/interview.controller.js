const { PDFParse } = require("pdf-parse");

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service");

const interviewReportModel =
    require("../models/iterviewReport.model");


// ======================================================
// GENERATE INTERVIEW REPORT
// ======================================================

async function generateInterViewReportController(req, res) {

    try {

        const resumeFile = req.file;
        const {
            selfDescription,
            jobDescription
        } = req.body;

        // Validate job description is required
        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        // Validate at least one of resume or self description is provided
        if (!resumeFile && !selfDescription) {
            return res.status(400).json({
                message: "Please upload a resume or provide a self-description"
            });
        }

        let resumeContent = "";

        // Process resume if provided
        if (resumeFile) {
            const parser = new PDFParse({
                data: resumeFile.buffer
            });

            const result = await parser.getText();
            resumeContent = result.text;
            await parser.destroy();
        }

        // ==================================================
        // GEMINI GENERATION
        // ==================================================

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription
        });

        // Validate AI response
        if (!interviewReportByAi || typeof interviewReportByAi !== 'object') {
            return res.status(500).json({
                message: "AI generation failed - invalid response format"
            });
        }

        // ==================================================
        // SAVE ONLY VALID AI REPORT
        // ==================================================

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interviewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            report: interviewReport
        });

    } catch (error) {

        console.error("INTERVIEW ERROR:", error);

        // ==================================================
        // GEMINI QUOTA / RATE LIMIT
        // ==================================================

        if (
            error?.status === 429 ||
            error?.statusCode === 429 ||
            error?.message?.includes("RESOURCE_EXHAUSTED") ||
            error?.message?.includes("Quota exceeded")
        ) {
            return res.status(429).json({
                message: "AI daily limit reached",
                error: "Gemini API quota has been exhausted. Please try again later."
            });
        }

        // ==================================================
        // OTHER AI ERRORS
        // ==================================================

        if (
            error?.message?.includes("AI failed") ||
            error?.message?.includes("Gemini")
        ) {
            return res.status(502).json({
                message: "AI generation failed",
                error: error.message
            });
        }

        // ==================================================
        // GENERAL SERVER ERROR
        // ==================================================

        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });

    }

}


// ======================================================
// GET ONE INTERVIEW REPORT
// ======================================================

async function getInterviewReportByIdController(
    req,
    res
) {

    try {

        const {
            interviewId
        } = req.params;


        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewId,

                user: req.user.id

            });


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found"

            });

        }


        return res.status(200).json({

            message:
                "Interview report fetched successfully",

            report:
                interviewReport

        });

    } catch (error) {

        console.error(
            "GET INTERVIEW REPORT ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Something went wrong",

            error:
                error.message

        });

    }

}


// ======================================================
// GET ALL INTERVIEW REPORTS
// ======================================================

async function getAllInterviewReportsController(
    req,
    res
) {

    try {

        const interviewReports =
            await interviewReportModel

                .find({
                    user: req.user.id
                })

                .sort({
                    createdAt: -1
                })

                .select(
                    "jobTitle matchScore createdAt"
                );


        return res.status(200).json({

            message:
                "Interview reports fetched successfully",

            reports:
                interviewReports

        });

    } catch (error) {

        console.error(
            "GET ALL INTERVIEW REPORTS ERROR:",
            error
        );


        return res.status(500).json({

            message:
                "Something went wrong",

            error:
                error.message

        });

    }

}


// ======================================================
// GENERATE RESUME PDF
// ======================================================

async function generateResumePdfController(
    req,
    res
) {

    try {

        const {
            interviewReportId
        } = req.params;


        // IMPORTANT:
        // Only allow the logged-in user to access
        // their own interview report.

        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewReportId,

                user: req.user.id

            });


        if (!interviewReport) {

            return res.status(404).json({

                message:
                    "Interview report not found."

            });

        }


        const {
            resume,
            jobDescription,
            selfDescription
        } = interviewReport;


        const pdfBuffer =
            await generateResumePdf({

                resume,

                jobDescription,

                selfDescription

            });


        res.set({

            "Content-Type":
                "application/pdf",

            "Content-Disposition":
                `attachment; filename=resume_${interviewReportId}.pdf`

        });


        return res.send(
            pdfBuffer
        );

    } catch (error) {

        console.error(
            "GENERATE RESUME PDF ERROR:",
            error
        );


        // Gemini quota
        if (

            error?.status === 429 ||

            error?.statusCode === 429 ||

            error?.message?.includes(
                "RESOURCE_EXHAUSTED"
            ) ||

            error?.message?.includes(
                "Quota exceeded"
            )

        ) {

            return res.status(429).json({

                message:
                    "AI daily limit reached",

                error:
                    "Gemini API quota has been exhausted. Resume generation cannot use AI until the quota is available again."

            });

        }


        return res.status(500).json({

            message:
                "Failed to generate resume PDF",

            error:
                error.message

        });

    }

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    generateInterViewReportController,

    getInterviewReportByIdController,

    getAllInterviewReportsController,

    generateResumePdfController

};