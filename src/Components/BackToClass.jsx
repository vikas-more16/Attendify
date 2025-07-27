import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BackToClass({ classId }) {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center p-3 ms-5">
      <button
        className="text-decoration-none text-dark d-flex align-items-center gap-2"
        onClick={() => navigate(`/manage-class/${classId}`)}
      >
        <FaArrowLeft />
        <span className="fw-semibold">Back to Class</span>
      </button>
    </div>
  );
}

export default BackToClass;
