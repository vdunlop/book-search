const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),  
  
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token|| req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }


    // different in 26 stu
//    if (!token) {
 //     return res.status(400).json({ message: 'You have no token!' });
 //   }
 if (!token) {
  return req;
}
    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
 //     return res.status(400).json({ message: 'Invalid token!' });
    }

    // send to next endpoint; this isn't in 26 stu
 //   next();
  },
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
