import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import fetchModel from "../../lib/fetchModelData";
// import models from "../../modelData/models";
import "./styles.css";

function TopBar({currentUser, setCurrentUser}) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const match = location.pathname.match(/^\/(users|photos)\/([^/]+)/);
  const userId = match ? match[2] : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          const data = await fetchModel(
            `${process.env.REACT_APP_API_PREFIX}/user/${userId}`
          );
          setUser(data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [userId]);

  let title = "Photo Sharing App";
  if (location.pathname.startsWith("/users/") && user) {
    title = `${user.first_name} ${user.last_name}`;
  }
  if (location.pathname.startsWith("/photos/") && user) {
    title = `Photos of ${user.first_name} ${user.last_name}`;
  }

    return (
      <AppBar position="absolute">
        <Toolbar
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
            position: "relative",
          }}
        >
          <Typography variant="h6" style={{ flex: 1 }}>
            Photo sharing app
          </Typography>

          <Typography
            variant="h6"
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none", // tránh che button nếu cần
            }}
          >
            {title}
          </Typography>

          {currentUser ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Typography variant="body1">Hi, {currentUser.first_name}</Typography>

              <Button
                variant="outlined"
                component={Link}
                to={`/users/${currentUser._id}`}
                color="inherit"
              >
                My Info
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  // Xoá ảnh lưu local của user hiện tại
                  if (currentUser && currentUser._id) {
                    localStorage.removeItem(`newPhotos-${currentUser._id}`);
                  }

                  // Xoá currentUser (đăng xuất)
                  setCurrentUser(null);
                  navigate("/log-in");
                }}
                color="inherit"
              >
                Log out
              </Button>
            </div>
          ) : (
            <Button component={Link} to="/log-in" color="inherit" style={{ flex: 1, justifyContent: "flex-end" }}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
  );
}

export default TopBar;
