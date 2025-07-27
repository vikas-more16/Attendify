import AttendancePage from "../AttendancePage";
import BackToDashboard from "../BackToDashboard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

function ManageClassPage() {
  const { id } = useParams();
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const classRes = await axios.get(
          `${API_ENDPOINTS.CLASSES}/${id}`
        );
        const attendanceRes = await axios.get(
          `${API_ENDPOINTS.ATTENDANCE}/class/${id}`
        );

        setSelectedClass(classRes.data);
        setAttendanceSessions(attendanceRes.data.sessions);
        setAttendanceRecords(attendanceRes.data.records);
        setStudents(attendanceRes.data.students);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [id]);
  return (
    <>
      <BackToDashboard />
      <AttendancePage
        selectedClass={selectedClass}
        attendanceSessions={attendanceSessions}
        attendanceRecords={attendanceRecords}
        students={students}
      />
    </>
  );
}

export default ManageClassPage;
