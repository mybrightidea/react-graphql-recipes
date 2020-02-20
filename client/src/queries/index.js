import { gql } from "apollo-boost";
import { recipeFragments } from "./fragments";

// recipes queries
export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;
export const GET_RECIPE = gql`
  query($_id: ID!) {
    getRecipe(_id: $_id) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;
export const SEARCH_RECIPES = gql`
  query($searchTerm: String) {
    searchRecipes(searchTerm: $searchTerm) {
      _id
      name
      category
      likes
    }
  }
`;

export const GET_USER_RECIPES = gql`
  query($email: String!) {
    getUserRecipes(email: $email) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;

// recipes mutations

export const ADD_RECIPE = gql`
  mutation(
    $name: String!
    $imageUrl: String!
    $description: String!
    $category: String!
    $instructions: String!
    $email: String
  ) {
    addRecipe(
      name: $name
      imageUrl: $imageUrl
      description: $description
      category: $category
      instructions: $instructions
      email: $email
    ) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;
export const DELETE_USER_RECIPE = gql`
  mutation($_id: ID!) {
    deleteUserRecipe(_id: $_id) {
      _id
    }
  }
`;

export const UPDATE_USER_RECIPE = gql`
  mutation(
    $_id: ID!
    $name: String!
    $imageUrl: String!
    $description: String!
    $category: String!
  ) {
    updateUserRecipe(
      _id: $_id
      name: $name
      imageUrl: $imageUrl
      description: $description
      category: $category
    ) {
      ...CompleteRecipe
    }
  }
  ${recipeFragments.recipe}
`;

export const LIKE_RECIPE = gql`
  mutation($email: String!, $_id: ID!) {
    likeRecipe(email: $email, _id: $_id) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`;

export const UNLIKE_RECIPE = gql`
  mutation($email: String!, $_id: ID!) {
    unlikeRecipe(email: $email, _id: $_id) {
      ...LikeRecipe
    }
  }
  ${recipeFragments.like}
`;

// user queries

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      joinDate
      email
      favourites {
        _id
        name
      }
    }
  }
`;

// user mutations

export const SIGNIN_USER = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($email: String!, $password: String!) {
    signupUser(email: $email, password: $password) {
      token
    }
  }
`;
