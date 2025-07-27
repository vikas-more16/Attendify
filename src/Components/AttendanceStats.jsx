function AttendanceStats({
  selectedClass,
  attendanceSessions = [],
  attendanceRecords = [],
}) {
  if (!selectedClass) return null;

  const classSessions = attendanceSessions.filter(
    (session) => session.classId === selectedClass._id
  );

  const classAttendance = attendanceRecords.filter(
    (record) => record.classId === selectedClass._id
  );

  const noOfSessions = classSessions.length;
  const totalRecords = classAttendance.length;

  const noOfPresentStudents = classAttendance.filter(
    (r) => r.status === "Present"
  ).length;

  const noOfAbsentStudents = classAttendance.filter(
    (r) => r.status === "Absent"
  ).length;

  const noOfPresentStudentsPercentage =
    totalRecords > 0
      ? ((noOfPresentStudents / totalRecords) * 100).toFixed(1)
      : 0;

  const noOfAbsentStudentsPercentage =
    totalRecords > 0
      ? ((noOfAbsentStudents / totalRecords) * 100).toFixed(1)
      : 0;

  return (
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="bg-white p-3 rounded shadow-sm text-center">
          <h6>Total Students</h6>
          <h4>{selectedClass.noOfStudents}</h4>
        </div>
      </div>
      <div className="col-md-3">
        <div className="bg-white p-3 rounded shadow-sm text-center">
          <h6>No. of Sessions</h6>
          <h4>{noOfSessions}</h4>
        </div>
      </div>
      <div className="col-md-3">
        <div className="bg-white p-3 rounded shadow-sm text-center">
          <h6>Attendance Rate</h6>
          <h4 className="text-success">{noOfPresentStudentsPercentage}%</h4>
        </div>
      </div>
      <div className="col-md-3">
        <div className="bg-white p-3 rounded shadow-sm text-center">
          <h6>Absentee Rate</h6>
          <h4 className="text-danger">{noOfAbsentStudentsPercentage}%</h4>
        </div>
      </div>
    </div>
  );
}

export default AttendanceStats;
