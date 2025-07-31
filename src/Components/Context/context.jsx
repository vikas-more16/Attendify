// context.js
import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export const AppContext = createContext();

// Cache for teacher data
const teacherCache = new Map();

const AppProvider = ({ children }) => {
  const [teacherId, setTeacherId] = useState(null); // MongoDB _id
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [firebaseUID, setFirebaseUID] = useState(null); // Firebase UID

  // Memoized fetch teacher function with caching
  const fetchTeacherData = useCallback(async (uid) => {
    // Check cache first
    if (teacherCache.has(uid)) {
      const cachedData = teacherCache.get(uid);
      setTeacherId(cachedData._id);
      setUserName(cachedData.name);
      return;
    }

    try {
      const res = await axios.get(
        `${API_ENDPOINTS.TEACHERS}/firebase/${uid}`
      );
      const teacher = res.data;

      // Cache the teacher data
      teacherCache.set(uid, teacher);

      setTeacherId(teacher._id); // MongoDB ObjectId
      setUserName(teacher.name);
      console.log(teacher);
    } catch (err) {
      console.error("Error fetching teacher from backend:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUID(user.uid);
        setUserEmail(user.email);
        localStorage.setItem("isLoggedIn", "true");

        // Only fetch teacher if registered
        if (localStorage.getItem("teacherRegistered") === "true") {
          await fetchTeacherData(user.uid);
        }
      } else {
        setTeacherId(null);
        setUserEmail(null);
        setFirebaseUID(null);
        setUserName(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("teacherRegistered");
        // Clear cache on logout
        teacherCache.clear();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchTeacherData]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    teacherId,
    userEmail,
    userName,
    firebaseUID,
    fetchTeacherData, // Expose for manual cache invalidation
  }), [teacherId, userEmail, userName, firebaseUID, fetchTeacherData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking Authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
