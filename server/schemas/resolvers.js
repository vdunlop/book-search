const { Book, User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    getSingleUser: async (parent, { id }) => {
      return User.findOne({ id }).populate("savedBooks");
    },

    getMe: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("savedBooks");
      }
      throw AuthenticationError;
    },
    getUsers: async () => {
      return User.find().populate("savedBooks");
    },
  },

  Mutation: {
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const book = Book.create({
          //          title, description: context.user.username,
          input,
        });

        User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input.book._id } }
        );

        return book;
      }
      throw AuthenticationError;
    },

    //     return  Book.create({ input });
    //   },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          _id: bookId,
        });
        await User.findOneAndUpdate(
          {_id:context.user._id },
          { $pull: {savedBooks: book._id}}
        );
        return book;
      }
      throw AuthenticationError;
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return token, user;
    },
  },
};

module.exports = resolvers;
