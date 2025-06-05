import React from "react";
import { useParams, Link } from "react-router-dom";
import models from "../../modelData/models";
import { Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import fetchModel from "../../lib/fetchModelData";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const fetchData = async() => {
      try{
        const data = await fetchModel(process.env.REACT_APP_API_PREFIX + `/user/${userId}`);
        setUser(data);
      }
      catch(error){
        console.log(error);
      }
    };
    fetchData();
  }, [userId]);

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <Typography variant="h5">
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">Location: {user.location}</Typography>
      <Typography variant="body1">Occupation: {user.occupation}</Typography>
      <Typography variant="body1">Description: {user.description}</Typography>

      <Button
        variant="contained"
        component={Link}
        to={`/photos/${user._id}`}
        style={{ marginTop: "16px" }}
      >
        Xem ảnh của {user.first_name}
      </Button>
    </div>
  );
}

export default UserDetail;
