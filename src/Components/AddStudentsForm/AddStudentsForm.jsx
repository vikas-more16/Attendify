import { useParams } from "react-router-dom";
import BackToClass from "../BackToClass";
import AddStudentForm from "../AddStudentform";

function AddStudentsForm() {
  const { classId } = useParams();

  return (
    <>
      <BackToClass classId={classId} />
      <AddStudentForm classId={classId} />
    </>
  );
}

export default AddStudentsForm;
