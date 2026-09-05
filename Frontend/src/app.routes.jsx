import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Protected from "./features/auth/components/Protected";
import Interview from "./features/interview/pages/Interview";
import InterviewBuilder from "./features/interview/pages/InterviewBuilder";
import Reports from "./features/interview/pages/Reports";
import Home from "./features/interview/pages/Home";
import AppShell from "./components/layout/AppShell";
import RootHome from "./pages/RootHome";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <RootHome />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/dashboard",
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: "/interview-builder",
        element: (
          <Protected>
            <InterviewBuilder />
          </Protected>
        ),
      },
      {
        path: "/reports",
        element: (
          <Protected>
            <Reports />
          </Protected>
        ),
      },
      {
        path: "/interview/:interviewId",
        element: (
          <Protected>
            <Interview />
          </Protected>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protected>
            <div className="dashboard">
              <div className="dashboard-header">
                <h1>Profile</h1>
              </div>
              <p>Profile page coming soon.</p>
            </div>
          </Protected>
        ),
      },
      {
        path: "/settings",
        element: (
          <Protected>
            <div className="dashboard">
              <div className="dashboard-header">
                <h1>Settings</h1>
              </div>
              <p>Settings page coming soon.</p>
            </div>
          </Protected>
        ),
      },
    ],
  },
]);
