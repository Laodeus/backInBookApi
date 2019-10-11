const jsonWebToken = require("jsonwebtoken");
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

// nedded type inclusion for recursivity
const CommentType = require("./../comment/commentType");

// import nedded data
const {books,authors,users,comments} = require("./../../js/dummydata/dummy");

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
      email: { type: GraphQLString },
      name: { type: GraphQLString },
      role: { type: GraphQLString },
      id: { type: GraphQLID },
      comment: {
        type: GraphQLList(CommentType),
        resolve(parent, args) {
          console.log(_.filter(comments, { book_id: parent.id }));
          return _.filter(comments, { user_id: parent.id });
        }
      }
    })
  });

  module.exports = UserType;