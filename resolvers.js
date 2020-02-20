const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = async (user, secret, expiresIn) => {
  const { email } = user;
  const token = await jwt.sign({ email }, secret, { expiresIn });
  return token;
};

exports.resolvers = {
  Query: {
    searchRecipes: async (root, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm }
          },
          {
            score: { $meta: "textScore" }
          }
        ).sort({
          score: { $meta: "textScore" }
        });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({
          likes: "desc",
          createdDate: "desc"
        });
        return recipes;
      }
    },

    getAllRecipes: async (root, args, { Recipe }) => {
      const allRecipes = await Recipe.find().sort({
        createdDate: "desc"
      });
      return allRecipes;
    },
    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },
    getUserRecipes: async (root, { email }, { Recipe }) => {
      const recipes = await Recipe.find({ email });
      return recipes;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        email: currentUser.email
      }).populate({
        path: "favourites",
        model: "Recipe"
      });
      return user;
    }
  },

  Mutation: {
    addRecipe: async (
      root,
      { imageUrl, name, description, category, instructions, email },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        imageUrl,
        name,
        description,
        category,
        instructions,
        email
      }).save();
      return newRecipe;
    },

    signinUser: async (root, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Invalid password");
      } else {
        return {
          token: createToken(user, process.env.SECRET, process.env.TOKEN_EXPIRY)
        };
      }
    },
    likeRecipe: async (root, { email, _id }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        {
          $inc: { likes: 1 }
        }
      );

      const user = await User.findOneAndUpdate(
        { email },
        {
          $addToSet: { favourites: _id }
        }
      );

      return recipe;
    },
    unlikeRecipe: async (root, { email, _id }, { Recipe, User }) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        {
          $inc: { likes: -1 }
        }
      );

      const user = await User.findOneAndUpdate(
        { email },
        {
          $pull: { favourites: _id }
        }
      );

      return recipe;
    },
    updateUserRecipe: async (
      root,
      { _id, name, imageUrl, description, category },
      { Recipe }
    ) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        {
          $set: {
            name,
            imageUrl,
            description,
            category
          }
        },
        { new: true }
      );
      return recipe;
    },
    deleteUserRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOneAndRemove({ _id });
      return recipe;
    },
    signupUser: async (root, { email, password }, { User }) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        email,
        password
      }).save();
      return {
        token: createToken(
          newUser,
          process.env.SECRET,
          process.env.TOKEN_EXPIRY
        )
      };
    }
  }
};
