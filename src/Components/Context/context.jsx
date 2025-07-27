// context.js
import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [teacherId, setTeacherId] = useState(null); // MongoDB _id
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [firebaseUID, setFirebaseUID] = useState(null); // Firebase UID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUID(user.uid);
        setUserEmail(user.email);
        localStorage.setItem("isLoggedIn", "true");

        // Only fetch teacher if registered
        if (localStorage.getItem("teacherRegistered") === "true") {
          try {
            const res = await axios.get(
              `${API_ENDPOINTS.TEACHERS}/firebase/${user.uid}`
            );
            const teacher = res.data;

            setTeacherId(teacher._id); // MongoDB ObjectId
            setUserName(teacher.name);
            console.log(teacher)

            // Update teacher info if needed
            // if (
            //   teacher.name === "New Teacher" ||
            //   teacher.name === "Teacher" ||
            //   teacher.email.startsWith("unknown_") ||
            //   teacher.email !== user.email
            // ) {
            //   await axios.put(
            //     `${API_ENDPOINTS.TEACHERS}/${teacher._id}`,
            //     {
            //       name: user.displayName || "Teacher",
            //       email: user.email,
            //     }
            //   );
            // }
          } catch (err) {
            console.error("Error fetching teacher from backend:", err);
          }
        }
      } else {
        setTeacherId(null);
        setUserEmail(null);
        setFirebaseUID(null);
        setUserName(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("teacherRegistered");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Checking Authentication...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        teacherId,
        userEmail,
        userName,
        firebaseUID, // Firebase UID now available globally
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
