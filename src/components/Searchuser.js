import React from "react";
import "./Searchuser.css";

const Searchuser = ({ userSearch }) => {
  const eventUpdate = (e) => {
    userSearch(e);
  };
  return (
    <div className="search">
      <input
        placeholder="Search by name, email or role etc..."
        onChange={eventUpdate}
      />
    </div>
  );
};

export default Searchuser;
