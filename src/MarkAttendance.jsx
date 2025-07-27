import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "./config";

function MarkAttendance() {
  const { classId, sessionId } = useParams();

  const [rollNumber, setRollNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if session is closed
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionRes = await axios.get(
          `${API_ENDPOINTS.SESSIONS}/${sessionId}`
        );
        const session = sessionRes.data;
        if (session.closed) {
          setSessionClosed(true);
        }
      } catch (err) {
        console.error("Error fetching session info", err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [sessionId]);

  // Fetch class, students, records
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const classRes = await axios.get(
          `${API_ENDPOINTS.CLASSES}/${classId}`
        );
        const attendanceRes = await axios.get(
          `${API_ENDPOINTS.ATTENDANCE}/class/${classId}`
        );
        setSelectedClass(classRes.data);
        setAttendanceSessions(attendanceRes.data.sessions);
        setAttendanceRecords(attendanceRes.data.records);
        setStudents(attendanceRes.data.students);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setMessage("Error loading data. Please try again.");
      }
    };

    if (classId) fetchAttendanceData();
  }, [classId]);

  // Early return after hooks
  if (loading) return <p>Loading...</p>;

  if (sessionClosed) {
    return (
      <div className="container mt-5 text-center">
        <h2>🚫 Attendance Closed</h2>
        <p>
          The QR code is no longer valid. Attendance for this session has been
          closed by the teacher.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const foundStudent = students.find(
      (student) => student.rollNo === rollNumber.trim()
    );

    if (!foundStudent) {
      setMessage("Roll number not found in this class.");
      setIsSubmitting(false);
      return;
    }

    const alreadyMarked = attendanceRecords.some(
      (record) =>
        String(record.sessionId) === String(sessionId) &&
        String(record.studentId) === String(foundStudent._id)
    );

    if (alreadyMarked) {
      setMessage("Attendance already marked for this student in this session.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        classId,
        sessionId,
        studentId: foundStudent._id,
        status: "Present",
      };

      await axios.post(`${API_ENDPOINTS.ATTENDANCE}/mark`, payload);

      setAttendanceRecords((prev) => [
        ...prev,
        {
          sessionId,
          studentId: foundStudent._id,
          status: "Present",
        },
      ]);

      setMessage(
        `Attendance marked successfully for ${foundStudent.studentName}`
      );
    } catch (error) {
      console.error("Error marking attendance", error);
      setMessage("Error marking attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
      setRollNumber("");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Mark Attendance</h3>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label htmlFor="rollNumber" className="form-label">
            Enter Roll Number:
          </label>
          <input
            type="text"
            id="rollNumber"
            className="form-control"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Marking..." : "Mark Attendance"}
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default MarkAttendance;
