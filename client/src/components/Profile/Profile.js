import React from "react";
import UserInfo from "./UserInfo";
import UserRecipes from "./UserRecipes";
import withAuth from "../withAuth";
const Profile = ({ session }) => (
  <div className="App">
    <UserInfo session={session} />
    <UserRecipes email={session.getCurrentUser.email} />
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(Profile);
