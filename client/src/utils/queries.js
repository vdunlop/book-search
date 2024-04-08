import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query getSingleUser($id: ID!) {
    getSingleUser(id: $id) {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;

export const QUERY_USERS = gql`
query getUsers {
    getUsers {
        _id
        username
        email
        bookCount
        savedBooks {
            _id
            bookId
            authors
            description
            title
            image
            link
        }
    }
}
`;

export const QUERY_ME = gql`
  query getMe {
    getMe {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
