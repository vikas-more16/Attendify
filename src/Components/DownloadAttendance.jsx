import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

function DownloadAttendance({ classId, sessions }) {
  const [selectedSession, setSelectedSession] = useState("all");

  const handleDownload = async (format) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.ATTENDANCE_RECORDS}/download`,
        {
          params: {
            classId,
            sessionId: selectedSession,
            format,
          },
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `attendance_${selectedSession}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error", err);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      <div className="form-group me-2">
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
          className="form-select"
        >
          <option value="all">All Sessions</option>
          {sessions.map((session, index) => (
            <option value={session._id} key={session._id}>
              Session {index + 1}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => handleDownload("csv")} className="btn btn-success">
        Download CSV
      </button>
      <button onClick={() => handleDownload("pdf")} className="btn btn-primary">
        Download PDF
      </button>
    </div>
  );
}

export default DownloadAttendance;
