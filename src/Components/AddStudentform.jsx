import { useState } from "react";
import Papa from "papaparse";
import { useParams } from "react-router-dom";
import { API_ENDPOINTS } from "../config";

function AddStudentForm() {
  const { classId } = useParams();
  const [students, setStudents] = useState([{ roll: "", name: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Add manually
  const addStudent = () => {
    setStudents([...students, { roll: "", name: "" }]);
  };

  const removeStudent = (index) => {
    const updated = students.filter((_, i) => i !== index);
    setStudents(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = value;
    setStudents(updated);
  };
  //Upload CSV file
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const csvStudents = result.data.map((row) => ({
          roll: row["Roll No"] || "",
          name: row["Name"] || "",
        }));
        setStudents(csvStudents);
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Validate that all students have both roll and name
    const isValid = students.every(
      (student) => student.roll.trim() && student.name.trim()
    );

    if (!isValid) {
      setMessage("Please fill in all fields for all students.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.STUDENTS}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: classId,
          students: students,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Failed to add");

      alert("Students added successfully!");
      // ✅ Reset the form after successful submission
      setStudents([{ roll: "", name: "" }]);
    } catch (error) {
      console.error("Error adding students:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-light rounded shadow-sm">
      <h4 className="mb-3">Add Students</h4>

      {students.map((student, index) => (
        <div className="row mb-2 align-items-center" key={index}>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Roll No"
              value={student.roll}
              onChange={(e) => handleChange(index, "roll", e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Student Name"
              value={student.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
          </div>
          <div className="col-md-2 text-end">
            {students.length > 1 && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeStudent(index)}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={addStudent}
        >
          + Add More
        </button>
        <button type="submit" className="btn btn-primary">
          Add to class
        </button>
      </div>

      {/* 📤 Upload CSV File */}
      <div className="mb-3">
        <label htmlFor="csvUpload" className="form-label">
          Upload CSV file:
        </label>
        <input
          type="file"
          className="form-control"
          accept=".csv"
          onChange={handleCSVUpload}
        />
      </div>
    </form>
  );
}

export default AddStudentForm;
