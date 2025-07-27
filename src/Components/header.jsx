import { FaSignOutAlt } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import { IoMdContact } from "react-icons/io";
import { useContext } from "react";
import { AppContext } from "../Components/Context/context"; // adjust path
import { auth } from "../firebase"; // ✅ Correct named import
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Header() {
  const { userName } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // redirect to login
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  console.log(userName)

  return (
    <header className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white header">
      <h5 className="fw-bold header-margin">
        <span>
          <LuGraduationCap size={35} className="LuGraduationCap Attendify" />
          Attendify
        </span>
      </h5>
      <div className="d-flex align-items-center gap-3 header-margin-right">
        <span>
          <IoMdContact className="LuGraduationCap SmartPresence" size={25} />
          {userName ? `${userName}` : "Guest"}
        </span>
        <button onClick={handleLogout}>
          <FaSignOutAlt className="text-danger" size={20} /> Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
