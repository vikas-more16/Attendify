import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ViewStudentsPage.css";
import BackToClass from "./BackToClass";
import { API_ENDPOINTS } from "../config";

function ViewStudentsPage() {
  const { classId } = useParams();
  const [students, setStudents] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.STUDENTS}/class/${classId}`
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchStudents();
  }, [classId]);

  return (
    <>
      <BackToClass classId={classId} />
      <div className="view-students-container">
        {loading ? (
          <p>Loading students...</p>
        ) : students && students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <ul className="view-students-list">
            {students
              .slice()
              .sort((a, b) =>
                a.rollNo > b.rollNo ? 1 : a.rollNo < b.rollNo ? -1 : 0
              )
              .map((student, index) => (
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
