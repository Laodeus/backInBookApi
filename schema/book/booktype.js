const jsonWebToken = require("jsonwebtoken");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
      id: { type: GraphQLID },
      title: { type: GraphQLString },
      subtitle: { type: GraphQLString },
      blanket: { type: GraphQLString },
      lang: { type: GraphQLString },
      format_book: { type: GraphQLString },
      genre: { type: GraphQLString },
      stock: { type: GraphQLInt },
      ISBN: { type: GraphQLString },
      author: {
        type: AuthorType,
        resolve(parent, args) {
          return _.find(authors, { id: parent.author_id });
        }
      },
       comment: {
         type: GraphQLList(CommentType),
         resolve(parent, args) {
           //console.log(_.filter(comments, { book_id: parent.id }));
           console.log(comments);

           return _.filter(comments, { book_id: parent.id });
         }
       },
       borrower_id : { type: GraphQLID },
       borrower_date : { type: GraphQLString },
       state : { type: GraphQLString },
    })
  });

  module.exports = BookType;

  // nedded type inclusion for recursivity
const AuthorType = require("./../author/authortype");
const CommentType = require("./../comment/commentType");
const UserType = require("./../user/usertype");

// import nedded data
const books = require("./../../js/dummydata/books");
const users = require("./../../js/dummydata/users");
const authors = require("./../../js/dummydata/authors");
const comments = require("./../../js/dummydata/comments");
