import React from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import models from "../../modelData/models";
import "./styles.css";

function UserPhotos() {
  const { userId } = useParams();
  const photos = models.photoOfUserModel(userId); // Lấy photos từ model
  console.log("Photos data:", photos); // Debug logs

  // Kiểm tra nếu photos là null hoặc undefined
  if (!photos || photos.length === 0) {
    return <p>No photos to display.</p>;
  }

  return (
    <div className="photo-container">
      {photos.map((photo) => (
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
                    <Link to={`/users/${comment.user._id}`}>
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
      ))}
    </div>
  );
}

export default UserPhotos;
