import { useState, useEffect } from "react";
import { FaQrcode } from "react-icons/fa";
import BackToDashboard from "../BackToDashboard";
import { useParams } from "react-router-dom";
import axios from "axios";
import QRInfo from "./QRInfo";
import QRCode from "react-qr-code";
import { API_ENDPOINTS } from "../../config";

function QRCodeGenerator() {
  const { id } = useParams();
  const [selectedClass, setSelectedClass] = useState({});
  const [isGenerated, setIsGenerated] = useState(false);
  const [sessionNo, setSessionNo] = useState(1);
  const [generatedSessionId, setGeneratedSessionId] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null); // Store present/absent info

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const classRes = await axios.get(
          `${API_ENDPOINTS.CLASSES}/${id}`
        );
        setSelectedClass(classRes.data);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchAttendanceData();
  }, [id]);

  const handleGenerate = async () => {
    try {
      const res = await axios.post(`${API_ENDPOINTS.SESSIONS}/${id}`);
      const newSession = res.data;
      setIsGenerated(true);
      setSessionNo(newSession.sessionNo);
      setGeneratedSessionId(newSession._id);
      setAttendanceStats(null); // reset stats
    } catch (error) {
      console.error("Error generating session:", error);
    }
  };

  const handleClose = async () => {
    try {
      // Mark absentees
      await axios.post(`${API_ENDPOINTS.ATTENDANCE}/mark-absent`, {
        classId: id,
        sessionId: generatedSessionId,
      });
      await axios.post(
        `${API_ENDPOINTS.SESSIONS}/close/${generatedSessionId}`
      );

      // Fetch attendance records of the session
      const res = await axios.get(
        `${API_ENDPOINTS.ATTENDANCE}/${generatedSessionId}`
      );

      const records = res.data;

      const present = records.filter((r) => r.status === "Present");
      const absent = records.filter((r) => r.status === "Absent");

      setAttendanceStats({
        presentCount: present.length,
        absentCount: absent.length,
        presentNames: present.map((r) => r.studentId.studentName),
        absentNames: absent.map((r) => r.studentId.studentName),
        presentRollNos: present.map((r) => r.studentId.rollNo),
        absentRollNos: absent.map((r) => r.studentId.rollNo),
      });

      setIsGenerated(false);
    } catch (error) {
      console.error("Error closing session or fetching records:", error);
    }
  };

  const qrCodeURL = `${window.location.origin}/markAttendance/${selectedClass._id}/${generatedSessionId}`;

  return (
    <>
      <BackToDashboard />
      <div className="container p-4">
        <h3 className="fw-bold mb-2">
          <FaQrcode className="me-2" /> QR Code Generator
        </h3>
        <p className="text-muted mb-4">
          Generate QR codes for {selectedClass.className} -{" "}
          {selectedClass.subject}
        </p>

        <div className="bg-white p-4 rounded shadow-sm text-center mb-4">
          {!isGenerated ? (
            <>
              <div className="p-4 bg-light rounded mb-3">
                <h5>
                  Class: <strong>{selectedClass.className}</strong>
                </h5>
                <p>Subject: {selectedClass.subject}</p>
                <p>Total Students: {selectedClass.noOfStudents}</p>
                <p>Next Session No: {selectedClass.noOfSessions + 1}</p>
              </div>

              <button className="btn btn-dark" onClick={handleGenerate}>
                <FaQrcode className="me-2" /> Generate QR Code
              </button>

              <p className="text-muted mt-2">
                Click to generate a new QR code for attendance
              </p>
            </>
          ) : (
            <>
              <div className="border border-dashed p-5 mb-3 rounded">
                <a href={qrCodeURL} target="_blank" rel="noreferrer">
                  <QRCode value={qrCodeURL} size={200} />
                </a>
                <p className="mt-3">Scan to Mark Attendance</p>
              </div>

              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleClose}>
                  Close QR Code
                </button>
                <p className="text-muted mt-2">
                  Click to stop attendance and mark absent those who haven't
                  responded
                </p>
              </div>
            </>
          )}
        </div>

        {/* Show stats after closing QR */}
        {attendanceStats && (
          <div className="bg-light p-4 rounded shadow-sm">
            <h5>Session {selectedClass.noOfSessions} Summary</h5>
            <p>
              ✅ Present: <strong>{attendanceStats.presentCount}</strong> <br />
              ❌ Absent: <strong>{attendanceStats.absentCount}</strong>
            </p>
            <div className="row">
              <div className="col-md-6">
                <h6>Present Students:</h6>
                <ul>
                  {attendanceStats.presentNames.map((name, idx) => (
                    <li key={idx}>
                      {attendanceStats.presentRollNos[idx]} - {name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-md-6">
                <h6>Absent Students:</h6>
                <ul>
                  {attendanceStats.absentNames.map((name, idx) => (
                    <li key={idx}>
                      {attendanceStats.absentRollNos[idx]} - {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <QRInfo />
      </div>
    </>
  );
}

export default QRCodeGenerator;
