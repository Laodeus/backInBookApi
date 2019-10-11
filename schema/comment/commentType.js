const jsonWebToken = require("jsonwebtoken");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: () => ({
      id: { type: GraphQLID },
      book: {
        type: BookType,
        resolve(parent, args) {
          return _.find(books, { id: parent.book_id });
        }
      },
      user: {
        type: UserType,
        resolve(parent, args) {
          console.log();
          return _.find(users, { id: parent.user_id });
        }
      },
      title: { type: GraphQLString },
      com: { type: GraphQLString },
      eval: { type: GraphQLString }
    })
  });

  module.exports = CommentType;

  // nedded type inclusion for recursivity
  const UserType = require("./../user/usertype");
  const BookType = require("./../book/booktype")

// import nedded data
const {books,users} = require("./../../js/dummydata/dummy");