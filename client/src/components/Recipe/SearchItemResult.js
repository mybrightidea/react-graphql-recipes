import React from 'react';
import { Link } from 'react-router-dom';

const SearchItemResult = ({ _id, name, category, likes }) => {
  return (
    <li>
      <Link to={`/recipes/${_id}`}>
        <h4>{name}</h4>
      </Link>
      <p>
        <strong>{category}</strong>
      </p>
      <p>Likes: {likes}</p>
    </li>
  );
};

export default SearchItemResult;
