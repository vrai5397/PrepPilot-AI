const express=require("express")
const {authUser}=require("../middlewares/auth.middleware")
const {generateInterViewReportController,getAllInterviewReportsController
,getInterviewReportByIdController,generateResumePdfController
}=require("../controllers/interview.controller")
const upload=require("../middlewares/file.middleware")
const interviewRouter= express.Router();
/**
 * post method /api/interview
 */
interviewRouter.post("/",authUser,upload.single("resume"),generateInterViewReportController)


/**
 * get method /api/interview/report/:interviewId
 */
interviewRouter.get("/report/:interviewId",authUser,getInterviewReportByIdController)


//  /api/interview

interviewRouter.get("/",authUser,getAllInterviewReportsController)

/**
 * tis is pdf gnerate route
 * 
 */

interviewRouter.post(
    "/resume/pdf/:interviewReportId",authUser,generateResumePdfController
);


module.exports=interviewRouter