import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CreateClassButton() {
  const navigate = useNavigate();
  return (
    <div className=" mb-5 mt-4">
      <button
        className="btn btn-dark"
        onClick={() => navigate(`/create-class`)}
      >
        <FaPlus /> Create New Class
      </button>
    </div>
  );
}

export default CreateClassButton;
