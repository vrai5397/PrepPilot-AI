const express = require("express");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const generateInterviewReport =  require("./services/ai.service");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

/** this requiring auth router */
const authRouter = require("./routes/auth.rout");

/** this is user authentication */
app.use("/api/auth", authRouter);


/**this is interviwe router */
const interviewRouter=require("./routes/interview.routes")
app.use("/api/interview",interviewRouter)

module.exports = app;