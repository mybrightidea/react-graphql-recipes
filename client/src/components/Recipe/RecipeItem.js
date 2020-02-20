import React from "react";
import { Link } from "react-router-dom";

const RecipeItem = ({ _id, name, imageUrl, category }) => {
  return (
    <Link
      to={`/recipes/${_id}`}
      // >
      //   <li
      className="card"
      //      style={{ background: `url(${imageUrl}) center center cover no-repeat` }}
      style={{
        backgroundImage: "url(" + imageUrl + ")",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <span className={category}>{category}</span>
      <div className="card-text">
        <h4>{name}</h4>
      </div>
      {/* </li> */}
    </Link>
  );
};

export default RecipeItem;
