import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Signout from "./Auth/Signout";
const Navbar = ({ session }) => (
  <nav>
    {session && session.getCurrentUser ? (
      <NavbarAuth session={session} />
    ) : (
      <NavbarUnAuth />
    )}
  </nav>
);

const NavbarUnAuth = () => {
  return (
    <ul>
      <li>
        <NavLink to="/" exact>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/search">Search</NavLink>
      </li>
      <li>
        <NavLink to="/signin">Sign In</NavLink>
      </li>
      <li>
        <NavLink to="/signup">Sign Up</NavLink>
      </li>
    </ul>
  );
};

const NavbarAuth = ({ session }) => {
  return (
    <Fragment>
      <ul>
        <li>
          <NavLink to="/" exact>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/search">Search</NavLink>
        </li>
        <li>
          <NavLink to="/recipe/add">Add Recipe</NavLink>
        </li>
        <li>
          <NavLink to="/user/profile">Profile</NavLink>
        </li>
        <li>
          <Signout />
        </li>
      </ul>
      <h4>
        {" "}
        Welcome <strong>{session.getCurrentUser.email}</strong>
      </h4>
    </Fragment>
  );
};

export default Navbar;
