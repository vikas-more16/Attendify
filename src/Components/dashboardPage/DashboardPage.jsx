import CreateClassButton from "../CreateClassButton";
import StatsCard from "../StatsCard";
import ClassCard from "../ClassCard";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../Context/context";
import { API_ENDPOINTS } from "../../config";

function DashboardPage() {
  // Fetch all classes for a given teacher
  const { firebaseUID } = useContext(AppContext);

  const [classes, setClasses] = useState([]);
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.CLASSES}/teacher/${firebaseUID}`
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchTeacherClasses();
  }, []);

  // Calculate totals from fetched data
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, cls) => sum + cls.noOfStudents, 0);
  const totalSessions = classes.reduce(
    (sum, cls) => sum + (cls.noOfSessions || 0),
    0
  );

  const stats = [
    { title: "Total Classes", value: totalClasses },
    { title: "Total Students", value: totalStudents },
    { title: "Total Sessions", value: totalSessions },
  ];

  return (
    <>
      <div className="container py-4">
        <CreateClassButton />
        <div className="row">
          {stats.map((s, i) => (
            <StatsCard key={i} title={s.title} value={s.value} />
          ))}
        </div>

        <h4 className="fw-bold mt-4">Your Classes</h4>
        <div className="row">
          {classes.map((s, i) => (
            <ClassCard
              key={i}
              className={s.className}
              subject={s.subject}
              students={s.noOfStudents}
              noOfSessions={s.noOfSessions}
              id={s._id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
