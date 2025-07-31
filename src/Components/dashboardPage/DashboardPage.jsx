import CreateClassButton from "../CreateClassButton";
import StatsCard from "../StatsCard";
import ClassCard from "../ClassCard";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useContext } from "react";
import { AppContext } from "../Context/context";
import { apiService } from "../../services/apiService";

function DashboardPage() {
  // Fetch all classes for a given teacher
  const { firebaseUID } = useContext(AppContext);

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeacherClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTeacherClasses(firebaseUID);
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setError("Failed to load classes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [firebaseUID]);

  useEffect(() => {
    if (firebaseUID) {
      fetchTeacherClasses();
    }
  }, [firebaseUID, fetchTeacherClasses]);

  // Memoized calculations to prevent unnecessary recalculations
  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const totalStudents = classes.reduce((sum, cls) => sum + cls.noOfStudents, 0);
    const totalSessions = classes.reduce(
      (sum, cls) => sum + (cls.noOfSessions || 0),
      0
    );

    return [
      { title: "Total Classes", value: totalClasses },
      { title: "Total Students", value: totalStudents },
      { title: "Total Sessions", value: totalSessions },
    ];
  }, [classes]);

  // Memoized sorted classes
  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => 
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  }, [classes]);

  if (loading) {
    return (
      <div className="container py-4">
        <CreateClassButton />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <CreateClassButton />
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-outline-danger ms-3" 
            onClick={fetchTeacherClasses}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        {sortedClasses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No classes found. Create your first class to get started!</p>
          </div>
        ) : (
          <div className="row">
            {sortedClasses.map((s, i) => (
              <ClassCard
                key={s._id || i}
                className={s.className}
                subject={s.subject}
                students={s.noOfStudents}
                noOfSessions={s.noOfSessions}
                id={s._id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardPage;
