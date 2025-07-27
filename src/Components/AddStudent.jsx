import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function AddStudents({ classId }) {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-dark"
      onClick={() => {
        navigate(`/add-students/${classId}`);
      }}
    >
      <IoIosAddCircleOutline className="me-2" size={25} />
      Add Students
    </button>
  );
}

export default AddStudents;
