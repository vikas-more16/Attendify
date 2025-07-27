import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../config";

function AttendanceRow({ rollNo, name, id, status, sessionId }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const statusColor = currentStatus === "Present" ? "success" : "danger";

  const handleOnClick = async () => {
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";

    try {
      await axios.put(`${API_ENDPOINTS.ATTENDANCE}/update-status`, {
        studentId: id,
        sessionId: sessionId,
        status: newStatus,
      });
      setCurrentStatus(newStatus);
    } catch (error) {
      alert("Failed to update attendance status.");
      console.error(error);
    }
  };

  return (
    <tr>
      <td>{rollNo}</td>
      <td>{name}</td>
      <td>{id}</td>
      {/* Debug: Show sessionIDS in the table for troubleshooting */}
      {/* <td>{sessionIDS}</td> */}
      <td>
        <span className={`badge bg-${statusColor}`}>{currentStatus}</span>
      </td>
      <td>
        <button
          onClick={handleOnClick}
          type="button"
          className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-center"
          title="Edit Attendance"
          style={{ minWidth: 32, minHeight: 32, padding: 0 }}
        >
          <FaEdit />
        </button>
      </td>
    </tr>
  );
}

export default AttendanceRow;
