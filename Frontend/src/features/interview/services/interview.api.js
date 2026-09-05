import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});


// ==========================================
// GENERATE INTERVIEW REPORT
// ==========================================

export const generateInterviewReport = async ({
    jobDescription,
    selfDescription,
    resumeFile
}) => {

    const formData = new FormData();

    formData.append(
        "jobDescription",
        jobDescription
    );

    formData.append(
        "selfDescription",
        selfDescription
    );

    // Only append resume if user selected one
    if (resumeFile) {
        formData.append(
            "resume",
            resumeFile
        );
    }


    const response = await api.post(
        "/api/interview",
        formData
    );


    return response.data;
};


// ==========================================
// GET REPORT BY ID
// ==========================================

export const getInterviewReportById = async (
    interviewId
) => {

    const response = await api.get(
        `/api/interview/report/${interviewId}`
    );

    return response.data;
};


// ==========================================
// GET ALL REPORTS
// ==========================================

export const getAllInterviewReports = async () => {

    const response = await api.get(
        "/api/interview/"
    );

    return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
    })

    return response.data
}