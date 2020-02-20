import React from "react";

import { Query } from "react-apollo";
import { GET_RECIPE } from "../../queries";
import LikeRecipe from "./LikeRecipe";
import Spinner from "../Spinner";

const hideEmail = email => {
  var s = email.indexOf("@");
  var e = email.lastIndexOf(".");
  return (
    email.substring(0, s + 1) + "..." + email.substring(e + 1, email.length)
  );
};

const RecipePage = ({ match }) => {
  const { _id } = match.params;

  return (
    <Query query={GET_RECIPE} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div className="error">Error</div>;
        return (
          <div className="App" style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <div
              className="recipe-image"
              style={{
                backgroundImage: "url(" + data.getRecipe.imageUrl + ")",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              }}
            ></div>
            <div className="recipe">
              <div className="recipe-header">
                <h2 className="recipe-name">
                  <strong>{data.getRecipe.name}</strong>
                </h2>
                <h5>
                  <strong>{data.getRecipe.category}</strong>
                </h5>
                <p>
                  Created By: <strong>{hideEmail(data.getRecipe.email)}</strong>
                </p>
                <p>
                  {data.getRecipe.likes}
                  <span
                    role="img"
                    aria-label="heart"
                    style={{ color: "red", fontSize: "1.3em" }}
                  >
                    &#9829;
                  </span>
                </p>
              </div>
              <blockquote className="recipe-description">
                {data.getRecipe.description}
              </blockquote>
              <h3 className="recipe-instructions__title">Instructions</h3>
              <div
                className="recipe-instructions"
                dangerouslySetInnerHTML={{
                  __html: data.getRecipe.instructions
                }}
              ></div>
              <LikeRecipe _id={_id} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default RecipePage;
