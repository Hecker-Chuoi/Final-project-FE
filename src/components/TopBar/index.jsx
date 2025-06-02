import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import models from "../../modelData/models";
import "./styles.css";

function TopBar() {
  const location = useLocation();
  const { userId } = useParams();
  let title = "Photo Sharing App";

  if (location.pathname.startsWith("/users/") && userId) {
    const user = models.userModel(userId);
    title = `${user.first_name} ${user.last_name}`;
  }

  if (location.pathname.startsWith("/photos/") && userId) {
    const user = models.userModel(userId);
    title = `Photos of ${user.first_name} ${user.last_name}`;
  }

  return (
    <AppBar position="absolute">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" className="left-name">
          Your Name
        </Typography>
        <Typography variant="h6" className="right-title">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
