const { Book, User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, {id}) => {
      return  User.findById( id ).populate("savedBooks");
    },

    getMe: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw AuthenticationError;
    },

    getUsers: async () => {
      return User.find({}).populate("savedBooks");
    },
  },

  Mutation: {
    saveBook: async (parent,{description, title, bookId, image, link}, context) => {
      // only add book if logged in
      if (!context.user) {
        // user not logged in
        throw AuthenticationError;
      }

      // create the book
      const book = Book.create({
        description, title, bookId, image, link
        });

        // add the new book to the user's saved books
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { book } },
          {
            new: true,
            runValidators: true,
          },
        );

      },

    login: async (parent, { email, password }) => {

      // find user
      const user =  await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      // match password
      const correctPw =  user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      // get token
      const token = signToken(user);

      return { token, user };
    },

    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        // user not logged in
        throw AuthenticationError;
      }

      // find the book
      const book =  Book.findOneAndDelete({
          _id: bookId,
      });
      return User.findOneAndUpdate(
          {_id:context.user._id },
          { $pull: {savedBooks: book._id}}
        );
    },
    
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = resolvers;
