import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import "./ViewStudentsPage.css";
import BackToClass from "./BackToClass";
import { apiService } from "../services/apiService";

function ViewStudentsPage() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getClassStudents(classId);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchStudents();
    }
  }, [classId, fetchStudents]);

  // Memoized sorted students to prevent unnecessary re-sorting
  const sortedStudents = useMemo(() => {
    return students
      .slice()
      .sort((a, b) => {
        // Sort by roll number, handling both string and numeric roll numbers
        const rollA = parseInt(a.rollNo) || a.rollNo;
        const rollB = parseInt(b.rollNo) || b.rollNo;
        return rollA > rollB ? 1 : rollA < rollB ? -1 : 0;
      });
  }, [students]);

  if (loading) {
    return (
      <>
        <BackToClass classId={classId} />
        <div className="view-students-container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading students...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BackToClass classId={classId} />
        <div className="view-students-container">
          <div className="alert alert-danger" role="alert">
            {error}
            <button 
              className="btn btn-outline-danger ms-3" 
              onClick={fetchStudents}
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackToClass classId={classId} />
      <div className="view-students-container">
        {students.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No students found in this class.</p>
          </div>
        ) : (
          <ul className="view-students-list">
            {sortedStudents.map((student, index) => (
              <li
                key={student._id || index}
                className="view-students-list-item"
              >
                <span className="view-students-roll">{student.rollNo}</span>{" "}
                {student.studentName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ViewStudentsPage;
