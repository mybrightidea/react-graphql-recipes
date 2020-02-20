const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const path = require("path");

const cors = require("cors");

const bodyParser = require("body-parser");

require("dotenv").config({ path: "variables.env" });

const Recipe = require("./models/Recipe.js");
const User = require("./models/User.js");

// bring in graphQL Middleware
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// create GraphQL schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

//connects to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB Connected"))
  .catch(err => console.error(err));

//initialises application
const app = express();

if (process.env.NODE_ENV !== "production") {
  const corsOptions = {
    origin: "http://localhost:3000",
    requirecredentials: true
  };

  app.use(cors(corsOptions));
}

//set up JWT auth middleware
app.use(async (req, resp, next) => {
  const token = req.headers["authorization"];
  if (token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (err) {}
  }
  next();
});

if (process.env.NODE_ENV !== "production") {
  // create graphql application
  app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));
}

//Connect schemas to GraphQL
app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
      Recipe,
      User,
      currentUser
    }
  }))
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT =
  (process.env.NODE_ENV === "production" && process.env.PORT) || 4444;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
