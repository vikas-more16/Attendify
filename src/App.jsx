import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import PrivateRoute from "./Components/PrivateRoute";
import { AppProvider, AppContext } from "./Components/Context/context";
import ErrorBoundary from "./Components/ErrorBoundary";
import "./firebase";

// Lazy load all route components
const DashboardPage = lazy(() => import("./Components/dashboardPage/DashboardPage"));
const ManageClassPage = lazy(() => import("./Components/classManagePage/ManageClassPage"));
const QRCodeGenerator = lazy(() => import("./Components/generateQRPage/QRCodeGenerator"));
const CreateNewClassForm = lazy(() => import("./Components/CreateNewClassForm/CreateNewClassForm"));
const AddStudentsForm = lazy(() => import("./Components/AddStudentsForm/AddStudentsForm"));
const TeacherLogin = lazy(() => import("./Components/TeacherLogin"));
const TeacherRegister = lazy(() => import("./Components/TeacherRegister"));
const MarkAttendance = lazy(() => import("./MarkAttendance"));
const ViewStudentsPage = lazy(() => import("./Components/ViewStudentsPage"));

// Loading component
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();

  // Check if current path is login or register
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/register-form";
  const isPublicPage = location.pathname.startsWith("/markAttendance");
  const hideHeader = isAuthPage || isPublicPage;

  return (
    <div className="bg-light min-vh-100">
      {/* Show Header only if user is logged in and not on login/register pages */}
      {!hideHeader && <Header />}
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<TeacherLogin />} />
            <Route path="/register-form" element={<TeacherRegister />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-class/:id"
              element={
                <PrivateRoute>
                  <ManageClassPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/generate-qr/:id"
              element={
                <PrivateRoute>
                  <QRCodeGenerator />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-class"
              element={
                <PrivateRoute>
                  <CreateNewClassForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-students/:classId"
              element={
                <PrivateRoute>
                  <AddStudentsForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-students/:classId"
              element={
                <PrivateRoute>
                  <ViewStudentsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/markAttendance/:classId/:sessionId"
              element={<MarkAttendance />}
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
