const jsonWebToken = require("jsonwebtoken");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

let queries = require("./../../js/queries");
const authVerif = require("./../../js/authverif"); // when this is called, when the token or the role is incorect, it stop everything and trhow an error :D
const passphrase = process.env.passphrase || "maPassPhraseEnDurSuperSecure";

const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: () => ({
      id: { type: GraphQLID },
      book: {
        type: BookType,
        async resolve(parent, args) {
          await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
          const query = await queries.book(parent.book_id);
          return query;
        }
      },
      user: {
        type: UserType,
        async resolve(parent, args) {
          console.log(parent.user_id);
          const query = await queries.usersById(parent.user_id);
          return query;
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
const books = require("./../../js/dummydata/books");
const users = require("./../../js/dummydata/users");
const authors = require("./../../js/dummydata/authors");
const comments = require("./../../js/dummydata/comments");
