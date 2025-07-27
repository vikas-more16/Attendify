import { FaQrcode, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ClassCard({ className, subject, students, noOfSessions, id }) {
  const navigate = useNavigate();
  return (
    <div className="col-12 col-md-4 mb-4">
      <div className="bg-white p-3 rounded shadow-sm">
        <div className="d-flex justify-content-between">
          <h5 className="fw-bold">{className}</h5>
          <span className="badge bg-light text-dark">{students} students</span>
        </div>
        <p className="text-muted m-0">{subject}</p>
        <p className="text-muted small">sessions: {noOfSessions}</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-dark w-50"
            onClick={() => {
              navigate(`/generate-qr/${id}`);
            }}
          >
            <FaQrcode /> Generate QR
          </button>
          <button
            className="btn btn-dark w-50"
            onClick={() => {
              navigate(`/manage-class/${id}`);
            }}
          >
            <FaUsers /> Manage
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassCard;
