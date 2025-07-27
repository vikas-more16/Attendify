import { useState, useEffect, useMemo } from "react";
import AttendanceRow from "./AttendanceRow";

function AttendanceTable({
  selectedClass = {},
  attendanceRecords = [],
  students = [],
  attendanceSessions = [],
}) {
  const [selectedSessionId, setSelectedSessionId] = useState("");

  const classSessions =
    attendanceSessions?.filter(
      (session) => session.classId === selectedClass._id
    ) || [];

  useEffect(() => {
    if (classSessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(classSessions[0]._id);
    }
  }, [classSessions, selectedSessionId]);

  const filteredRecords =
    attendanceRecords?.filter(
      (record) => record.sessionId === selectedSessionId
    ) || [];

  // ⚠️ FIX: Use useMemo to avoid stale renders
  const data = useMemo(() => {
    return filteredRecords
      .map((record) => {
        const student = students?.find((s) => s._id === record.studentId);
        return {
          rollNo: student?.rollNo || "Unknown",
          name: student?.studentName || "Unknown",
          id: record.studentId,
          status: record.status,
        };
      })
      .sort((a, b) => a.rollNo - b.rollNo);
  }, [filteredRecords, students]);

  // Debug logs
  useEffect(() => {
    console.log("Selected Session ID:", selectedSessionId);
    console.log("Filtered Records:", filteredRecords);
    console.log("Mapped Data:", data);
  }, [selectedSessionId, filteredRecords, data]);

  return (
    <div className="bg-white p-3 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Attendance Records</h5>
        <select
          className="form-select w-auto"
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
        >
          {classSessions.map((session, index) => (
            <option key={session._id} value={session._id}>
              Session {index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive-custom">
        <table className="table table-borderless">
          <thead>
            <tr>
              <th>Roll no.</th>
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((student, i) => (
                <AttendanceRow
                  key={`${student.id}-${selectedSessionId}`}
                  {...student}
                  sessionId={selectedSessionId}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5">No attendance session yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceTable;
