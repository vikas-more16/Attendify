import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./Context/context";

function PrivateRoute({ children }) {
  const { userEmail, loading } = useContext(AppContext);

  // Show loading while Firebase is initializing
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Redirect to login if not authenticated
  return userEmail ? children : <Navigate to="/" />;
}

export default PrivateRoute;
