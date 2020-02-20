import React from "react";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
const formatDate = date => {
  // const newDate = new Date(date).toLocaleDateString("en-GB");
  // const newTime = new Date(date).toLocaleTimeString("en-GB");

  // return `${newDate} at ${newTime}`;
  return dateFormat(Date(date), "dddd, mmmm dS, yyyy, h:MM:ss TT");
};

const UserInfo = ({ session }) => {
  return (
    <div>
      <h3>Your Profile</h3>
      <p>eMail: {session.getCurrentUser.email}</p>
      <p>Join Date: {formatDate(session.getCurrentUser.joinDate)}</p>

      <h3>Your Favourites</h3>
      <ul>
        {session.getCurrentUser.favourites.map(favourite => (
          <li key={favourite._id}>
            <Link to={`/recipes/${favourite._id}`}>
              <p>{favourite.name}</p>
            </Link>
          </li>
        ))}
      </ul>
      {!session.getCurrentUser.favourites.length && (
        <p>
          <strong>You have no favourites. Why not add some!</strong>
        </p>
      )}
    </div>
  );
};

export default UserInfo;
