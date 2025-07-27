import CreateClass from "../CreateClass";
import BackToDashboard from "../BackToDashboard";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../Context/context";

function CreateNewClassForm() {
  const { teacherId } = useContext(AppContext);
  return (
    <>
      <BackToDashboard />
      <CreateClass teacherId={teacherId} />
    </>
  );
}

export default CreateNewClassForm;
