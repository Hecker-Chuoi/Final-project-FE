// import React from "react";
// import {
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
// } from "@mui/material";

// import "./styles.css";
// import models from "../../modelData/models";

// /**
//  * Define UserList, a React component of Project 4.
//  */
// function UserList () {
//     const users = models.userListModel();
//     return (
//       <div>
//         <Typography variant="body1">
//           This is the user list, which takes up 3/12 of the window. You might
//           choose to use <a href="https://mui.com/components/lists/">Lists</a>{" "}
//           and <a href="https://mui.com/components/dividers/">Dividers</a> to
//           display your users like so:
//         </Typography>
//         <List component="nav">
//           {users.map((item) => (
//             <>
//               <ListItem>
//                       <ListItemText primary={item.first_name}/>
//               </ListItem>
//               <Divider />
//             </>
//           ))}
//         </List>
//         <Typography variant="body1">
//           The model comes in from models.userListModel()
//         </Typography>
//       </div>
//     );
// }

// export default UserList;

  import React, { useEffect, useState } from "react";
  import { List, ListItem, ListItemText } from "@mui/material";
  import { Link } from "react-router-dom";
  import fetchModel from "../../lib/fetchModelData";

  function UserList({currentUser}) {
    const [users, setUsers] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchModel(process.env.REACT_APP_API_PREFIX + "/user/list");
          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      console.log(users);
    }, [!currentUser]);

    return (
    <div>
      <List>
        {currentUser && users && users.map((user) => (
          <ListItem key={user.id}>
            <Link to={`/users/${user._id}`} style={{ textDecoration: "none" }}>
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserList;
