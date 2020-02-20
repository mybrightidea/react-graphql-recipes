exports.typeDefs = `

type Recipe {
    _id: ID
    name: String!
    imageUrl: String!
    description: String!
    instructions: String!
    category: String!
    createdDate: String
    likes: Int
    email: String!
}

type User {
    _id: ID!
    password: String!
    email: String!
    joinDate: String
    favourites: [Recipe]
}

type Query {
    getAllRecipes: [Recipe]

    searchRecipes(searchTerm: String): [Recipe]

    getRecipe (
        _id: ID!
    ): Recipe

    getUserRecipes(email: String!): [Recipe]

    getCurrentUser: User

}

type Token {
    token: String!
}


type Mutation {
    addRecipe(
        name: String!
        imageUrl: String!
        description: String!
        category: String!
        instructions: String!
        email: String
    ): Recipe

    updateUserRecipe(
        _id: ID!
        name: String!
        imageUrl: String!
        description: String!
        category: String!
    ): Recipe!

    deleteUserRecipe(_id: ID!): Recipe

    likeRecipe(
        email: String!,
        _id: ID!): Recipe

    unlikeRecipe(
        email: String!,
        _id: ID!): Recipe
    
    
    signinUser(
        email: String!, 
        password: String!
    ): Token


    signupUser(
        email: String!, 
        password: String!
    ): Token
}

`;
