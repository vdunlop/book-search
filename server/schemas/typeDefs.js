const typeDefs = `#graphql

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    password: String
    savedBooks: [Book]
}

input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}
type Book{
    id: ID!
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    getSingleUser(id: ID, username:String): User
    getMe: User
    getUsers: [User]
}

type Mutation {
    saveBook(input: BookInput): User
    removeBook(user: ID!, bookId:String!): User
    addUser(username:String!, email:String!, password:String!): Auth
    login(email: String!, password: String!): Auth
}
`;
module.exports = typeDefs;