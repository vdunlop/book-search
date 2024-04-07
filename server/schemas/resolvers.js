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
    saveBook: async (parent,args, context) => {
      if (context.user) {
        const book = Book.create({
      args         
//title, description: context.user.username,
        });

        // add the new book to the user's saved books
        User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.book._id } }
          // DO I need a { new: true} here????????????
        );

        return book;
      }
      throw AuthenticationError;
    },

    //     return  Book.create({ input });
    //   },

    login: async (parent, { email, password }) => {
      const user =  User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }

      const correctPw =  user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book =  Book.findOneAndDelete({
          _id: bookId,
        });
         User.findOneAndUpdate(
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
      return { token, user };
    },
  },
};

module.exports = resolvers;
