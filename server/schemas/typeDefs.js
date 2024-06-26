const typeDefs = `#graphql

type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
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
    getSingleUser(id: ID!): User
    getMe: User
    getUsers: [User]
}

type Mutation {
    saveBook(description:String, title:String, bookId:String, image:String, link:String): User
    removeBook(bookId:String!): User
    addUser(username:String!, email:String!, password:String!): Auth
    login(email: String!, password: String!): Auth
}
`;
module.exports = typeDefs;