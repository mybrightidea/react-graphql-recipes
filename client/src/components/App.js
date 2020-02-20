import React, { Component } from "react";
import { motion } from "framer-motion";

import "./App.css";

import { Query } from "react-apollo";
import { GET_ALL_RECIPES } from "../queries";
import RecipeItem from "./Recipe/RecipeItem";
import Spinner from "./Spinner";

// const Example = () => <motion.div animate={{ scale: 2 }} />;

const RecipeList = props => {
  const variants = {
    hide: { x: "-100%", opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  const { isOn, recipes } = props;
  return (
    <motion.div
      className="cards"
      initial="hide"
      animate={isOn ? "show" : "hide"}
      variants={variants}
    >
      {recipes.map(recipe => (
        <RecipeItem key={recipe._id} {...recipe} />
      ))}
    </motion.div>
  );
};

class App extends Component {
  state = { on: false };

  componentDidMount() {
    setTimeout(this.slideInOut, 400);
  }

  slideInOut = () => {
    this.setState({ on: !this.state.on });
    // setTimeout(this.slideInOut, 200);
  };

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Find Recipes You <strong>Love!</strong>
          <div className="example-container"></div>
        </h1>
        <Query query={GET_ALL_RECIPES}>
          {({ data, loading, error }) => {
            // if (loading) return <div className="loading">Loading ...</div>;
            if (loading) return <Spinner />;
            if (error) return <div className="error">Error</div>;

            const { on } = this.state;

            return <RecipeList isOn={on} recipes={data.getAllRecipes} />;
          }}
        </Query>
      </div>
    );
  }
}

export default App;
