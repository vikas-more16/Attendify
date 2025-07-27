import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import DashboardPage from "./Components/dashboardPage/DashboardPage";
import ManageClassPage from "./Components/classManagePage/ManageClassPage";
import QRCodeGenerator from "./Components/generateQRPage/QRCodeGenerator";
import CreateNewClassForm from "./Components/CreateNewClassForm/CreateNewClassForm";
import AddStudentsForm from "./Components/AddStudentsForm/AddStudentsForm";
import TeacherLogin from "./Components/TeacherLogin";
import TeacherRegister from "./Components/TeacherRegister";
import PrivateRoute from "./Components/PrivateRoute";
import { AppProvider, AppContext } from "./Components/Context/context";
import MarkAttendance from "./MarkAttendance";
import "./firebase";
import ViewStudentsPage from "./Components/ViewStudentsPage";

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
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
