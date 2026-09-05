import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";

import {
    generateInterviewReport,
    getInterviewReportById,
    getAllInterviewReports,
    generateResumePdf
} from "../services/interview.api";


export const useInterview = (interviewId) => {

    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error(
            "useInterview must be used within an InterviewProvider"
        );
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context;


    // ==========================================
    // GENERATE INTERVIEW REPORT
    // ==========================================

    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {

        setLoading(true);

        try {

            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            // Backend returns response.report
            setReport(response.report);

            return response.report;

        } catch (error) {

            console.error(
                "Generate interview report error:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GET ONE REPORT
    // ==========================================

    const getReport = async (id) => {

        setLoading(true);

        try {

            const response =
                await getInterviewReportById(id);

            setReport(response.report);

            return response.report;

        } catch (error) {

            console.error(
                "Get interview report error:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GET ALL REPORTS
    // ==========================================

    const getReports = async () => {

        setLoading(true);

        try {

            const response =
                await getAllInterviewReports();

            setReports(response.reports);

            return response.reports;

        } catch (error) {

            console.error(
                "Get all interview reports error:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GENERATE / DOWNLOAD RESUME PDF
    // ==========================================

    const getResumePdf = async (
        interviewReportId
    ) => {

        setLoading(true);

        try {

            const response =
                await generateResumePdf({
                    interviewReportId
                });


            // Axios usually returns PDF data in response.data.
            // If your API function already returns response.data,
            // this also works.

            const pdfData =
                response?.data || response;


            const blob =
                new Blob(
                    [pdfData],
                    {
                        type: "application/pdf"
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                `resume_${interviewReportId}.pdf`;


            document.body.appendChild(link);


            link.click();


            document.body.removeChild(link);


            // Free memory
            window.URL.revokeObjectURL(url);


            return true;

        } catch (error) {

            console.error(
                "Generate resume PDF error:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD REPORTS
    // ==========================================

    useEffect(() => {

        if (interviewId) {

            getReport(interviewId);

        } else {

            getReports();

        }

    }, [interviewId]);


    // ==========================================
    // RETURN
    // ==========================================

    return {

        loading,
        report,
        reports,

        generateReport,
        getReport,
        getReports,
        getResumePdf

    };

};