# react-graphql-recipes
## *An example architecture using Apollo Boost/React talking to a Mongo-implemented GraphQL API on a nodejs server* 

* Functionally the app allows public users to browse recipe database
* Authenticated users are allowed to create recipes
* Users allowed to add/remove likes

# Usage
* Initial state no users logged in, unauthenticated menu structure (Home/Search/Signin/Signup)
  * Home - list of recipes
  * Search - general keyword search in all text fields
  * Signin - for existing users
  * Signup - for new users

* Logging in/user creation issues an authentication token used to open up access to private authentcated menu structure (Home/Search/Add recipe/Profile)
* In addition to unauthenticated functions:
   * Add recipe enables the creation of a recipe
  * Profile shows user information and list of recipes owned by the user and list of recipes liked by the user

# Architecture features
## Server
* **Express server** is created in **nodejs** server (with CORS implemented to facilitate same-server client-server communication)
* **MongoDB** database is set up on **Atlas** cluster and accessed via **mongoose**
* Middleware set up to enforce **token authorisation** (**json web token or jwt**) between Apollo Client (**apollo-boost**) and server (**apollo-server-express**
* **apollo-server-express** **GraphQL** server set up to serve GraphQL requests - resolvers implemented using **mongoose** interface to **MongoDB**

## Client
* **react-router-dom** **Route**s implemented to control **Single Page Application**
* Simple animations for loading implemented using **framer**
* **Higher Order Functions** used to wrap components to manage authenticated/unauthenticated access via **react-router-dom** components
* **react-apollo** used to implement **Query** and **Mutation** components. These components use **render props** pattern to expose properties of the query or mutation to parameterise the calls, control when they are called in the case of mutations and also deal with cache/refresh to maintain synchronisation of screen components
