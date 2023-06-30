import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import "./Usertable.css";
const Usertable = ({ user, deleteUser, selectUser, checked }) => {
  const [userEdit, setuserEdit] = useState(false);
  const [userData, setUserData] = useState({
    username: user.name,
    email: user.email,
    role: user.role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setuserEdit(true);
  };

  const handleUpdate = () => {
    if (!userData.username || !userData.email || !userData.role) {
      console.log("Please fill in all fields.");
      return;
    }
    console.log("Updated User Data:", userData);

    // Reset the edit mode
    setuserEdit(false);
  };

  return (
    <tr key={user.id}>
      <td>
        <input type="checkbox" checked={checked} onChange={selectUser} />
      </td>
      <td>
        {userEdit ? (
          <input
            className="editUser"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        ) : (
          userData.username
        )}
      </td>
      <td>
        {userEdit ? (
          <input
            className="editUser"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
        ) : (
          userData.email
        )}
      </td>
      <td>
        {userEdit ? (
          <input
            className="editUser"
            name="role"
            value={userData.role}
            onChange={handleChange}
          />
        ) : (
          userData.role
        )}
      </td>
      <td>
        {userEdit ? (
          <button className="editButton" onClick={handleUpdate}>
            Update
          </button>
        ) : (
          <>
            <EditIcon fontSize="small" onClick={handleEdit} />
            <DeleteOutlinedIcon onClick={deleteUser} />
          </>
        )}
      </td>
    </tr>
  );
};

export default Usertable;
