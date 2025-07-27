import AttendanceStats from "./AttendanceStats";
import AttendanceTable from "./AttendanceTable";
import AddStudents from "./AddStudent";
import ViewStudents from "./ViewStudents";
import DownloadAttendance from "./DownloadAttendance";

function AttendancePage({
  selectedClass,
  attendanceSessions,
  attendanceRecords,
  students,
}) {
  if (!selectedClass) return <div className="text-center py-5">Loading...</div>;

  return (
    <>
      <div className="container py-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
          <div>
            <h2 className="fw-bold mb-1">Attendance Management</h2>
            <p className="text-muted mb-0">
              <strong>Class:</strong> {selectedClass.className} |{" "}
              <strong>Subject:</strong> {selectedClass.subject}
            </p>
          </div>
          <div className="d-flex gap-2">
            <ViewStudents classId={selectedClass._id} />
            <AddStudents classId={selectedClass._id} />
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="mb-4">
          <AttendanceStats
            selectedClass={selectedClass}
            attendanceSessions={attendanceSessions}
            attendanceRecords={attendanceRecords}
          />
        </div>

        {/* Attendance Table */}
        <AttendanceTable
          selectedClass={selectedClass}
          attendanceRecords={attendanceRecords}
          students={students}
          attendanceSessions={attendanceSessions}
        />
        {attendanceRecords.length > 0 ? (
          <div className="d-flex flex-column align-items-center mt-3 pt-3 border-top">
            <h5 className="mb-3">Download Attendance</h5>
            <DownloadAttendance
              classId={selectedClass._id}
              sessions={attendanceSessions}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default AttendancePage;
