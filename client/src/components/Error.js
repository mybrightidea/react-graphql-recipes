import React from "react";

const Error = ({ error }) => {
  return <p className="danger-error">{error.message}</p>;
};

export default Error;
