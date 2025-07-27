import { useNavigate } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";

function ViewStudents({ classId }) {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-dark"
      onClick={() => {
        navigate(`/view-students/${classId}`);
      }}
    >
      <IoPersonCircleOutline className="me-2" size={25} />
      View Students
    </button>
  );
}

export default ViewStudents;
