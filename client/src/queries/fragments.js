import { gql } from "apollo-boost";

// recipes queries
export const recipeFragments = {
  recipe: gql`
    fragment CompleteRecipe on Recipe {
      _id
      name
      imageUrl
      category
      description
      instructions
      likes
      createdDate
      email
    }
  `,
  like: gql`
    fragment LikeRecipe on Recipe {
      _id
      likes
    }
  `
};
