const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

// nedded type inclusion for recursivity
const BookType = require("./../book/booktype");

// import nedded data
const {books,authors,users,comments} = require("./../../js/dummydata/dummy");

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      books: {
        type: new GraphQLList(BookType),
        resolve(parent, args) {
          return _.filter(books, { authorId: parent.id });
        }
      }
    })
  });
  
  module.exports = AuthorType;