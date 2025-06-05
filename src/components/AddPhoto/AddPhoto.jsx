import React, { useState } from "react";

function AddPhoto() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch("http://localhost:8080/photos/new", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        setMessage(err.message || "Upload failed");
        return;
      }

      const result = await response.json();
      setMessage("Photo uploaded successfully!");
      // Optional: redirect to photo list
    } catch (err) {
      setMessage("Upload error.");
    }
  };

  return (
    <div>
      <h2>Add Photo</h2>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddPhoto;
