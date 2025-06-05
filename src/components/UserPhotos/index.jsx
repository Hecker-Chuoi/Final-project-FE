import React from "react";
import { useParams, Link } from "react-router-dom";
import {useState, useEffect} from "react";
import fetchModel from "../../lib/fetchModelData";
import { format } from "date-fns";
// import models from "../../modelData/models";
import "./styles.css";

function UserPhotos({currentUser}) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState(null);
  const [newComments, setNewComments] = useState({});
  const [error, setError] = useState("");
  const [newPhotosFromStorage, setNewPhotosFromStorage] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  // const photos = models.photoOfUserModel(userId);
  // console.log("Photos data:", photos);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchModel(process.env.REACT_APP_API_PREFIX + `/photo/photosOfUser/${userId}`);
        console.log(data);
        setPhotos(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    const storedPhotos = localStorage.getItem(`newPhotos-${userId}`);
    if (storedPhotos) {
      setNewPhotosFromStorage(JSON.parse(storedPhotos));
      }
  }, [userId]);


  const handleAddComment = async (photoId) => {
    const comment = newComments[photoId]?.trim();
    if (!comment) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_PREFIX}/photo/commentsOfPhoto/${photoId}?userId=${currentUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        setError(err.message || "Failed to add comment.");
        return;
      }

      const updatedPhoto = await response.json();

      // Cập nhật photo sau khi thêm comment
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo._id === photoId ? updatedPhoto : photo
        )
      );

      // Reset input
      setNewComments((prev) => ({ ...prev, [photoId]: "" }));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Server error.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newPhoto = {
        _id: `local-${Date.now()}`,
        file_name: file.name,
        data_url: reader.result,
        date_time: new Date().toISOString(),
        comments: [],
      };

      const updatedPhotos = [...newPhotosFromStorage, newPhoto];
      localStorage.setItem(
        `newPhotos-${userId}`,
        JSON.stringify(updatedPhotos)
      );

      setNewPhotosFromStorage(updatedPhotos);
    };
    reader.readAsDataURL(file);

    e.target.value = null;
  };

  const isCurrentUser = currentUser && currentUser._id === userId;

  if (!photos && newPhotosFromStorage.length === 0) {
    return <p>Loading photos...</p>;
  }

  if (!photos || photos.length === 0) {
    return <p>No photos to display.</p>;
  }

  return (
    <div className="photo-container">
      {isCurrentUser && (
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="file-upload" style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
            Add Photo
          </label>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Hiển thị ảnh mới từ localStorage trước */}
      {newPhotosFromStorage.map((photo) => (
        <div key={photo._id} className="photo-block" style={{ border: "1px solid green", marginBottom: "1rem" }}>
          <img src={photo.data_url} alt={photo.file_name} className="photo" />
          <p>Uploaded at {format(new Date(photo.date_time), "PPpp")} (local)</p>
          <p><i>This photo is saved locally only.</i></p>
        </div>
      ))}

      {photos.map((photo) => (
        <div>
        <div key={photo._id} className="photo-block">
          <img
            src={`/images/${photo.file_name}`}
            alt="User"
            className="photo"
          />
          <p className="photo-time">
            Uploaded at {format(new Date(photo.date_time), "PPpp")}
          </p>

          {photo.comments && photo.comments.length > 0 && (
            <div className="comments-section">
              <h4>Comments</h4>
              {photo.comments.map((comment) => (
                <div key={comment._id} className="comment-block">
                  <p>
                    <Link to={`/users/${comment.user.id}`}>
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>{" "}
                    ({format(new Date(comment.date_time), "PPpp")}):{" "}
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="add-comment-section">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComments[photo._id] || ""}
              onChange={(e) =>
                setNewComments((prev) => ({
                  ...prev,
                  [photo._id]: e.target.value,
                }))
              }
            />
            <button onClick={() => handleAddComment(photo._id)}>
              Post
            </button>
          </div>
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default UserPhotos;
