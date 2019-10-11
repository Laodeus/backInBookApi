const jsonWebToken = require("jsonwebtoken");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

// nedded type inclusion for recursivity
const BookType = require("./../user/usertype");

// import nedded data
const {books,authors,users,comments} = require("./../../js/dummydata/dummy");


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