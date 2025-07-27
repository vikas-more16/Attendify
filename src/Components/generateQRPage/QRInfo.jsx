function QRInfo() {
  return (
    <>
      <div className="bg-white p-4 rounded shadow-sm">
        <h5 className="fw-bold mb-3">Instructions</h5>
        <ul className="text-muted">
          <li>QR codes are valid for 5 minutes after generation</li>
          <li>Students need to scan the code to mark their attendance</li>
          <li>Each QR code can only be used once per student</li>
          <li>Generate a new code for each attendance session</li>
        </ul>
      </div>
    </>
  );
}

export default QRInfo;
