import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import Search from "./components/Recipe/Search";
import AddRecipe from "./components/Recipe/AddRecipe";
import RecipePage from "./components/Recipe/RecipePage";
import Profile from "./components/Profile/Profile";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import "./index.css";

import App from "./components/App";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const uri =
  window.location.hostname !== "localhost"
    ? "https://mbi-react-graphql-recipes.herokuapp.com/graphql"
    : "http://localhost:4444/graphql";
const client = new ApolloClient({
  uri,
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError({ networkError }) {
    if (networkError) {
      console.log("Network Error", networkError);
    }
  }
});

const Root = ({ refetch, session }) => (
  <Fragment>
    <Router>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" component={Search} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route path="/signup" render={() => <Signup refetch={refetch} />} />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe refetch={refetch} session={session} />}
        />
        <Route path="/recipes/:_id" component={RecipePage} />

        <Route
          path="/user/profile"
          render={() => <Profile session={session} />}
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  </Fragment>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);
