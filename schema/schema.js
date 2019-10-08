const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");

//dummy data
let books = [
  { name: "indiana jones", genre: "adventure", id: "1", authorId: "1" },
  { name: "star wars", genre: "sci-fi", id: "2", authorId: "3" },
  { name: "goonies", genre: "family", id: "3", authorId: "3" },
  { name: "dick", genre: "porn", id: "4", authorId: "1" },
  { name: "tais toi", genre: "comedy", id: "5", authorId: "2" },
  { name: "ça", genre: "horror", id: "6", authorId: "4" }
];

let authors = [
  { name: "robert mabite", age: 32, id: "1" },
  { name: "madeleine tachatte", age: 18, id: "2" },
  { name: "Robert k. dick", age: 60, id: "3" },
  { name: "stephen king", age: 63, id: "4" }
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
        type: AuthorType,
        resolve(parent, args){
            console.log(parent);
            return _.find(authors,{id:parent.authorId});
        }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
        type: new GraphQLList(BookType),
        resolve(parent, args){
            return _.filter(books, {authorId: parent.id})
        }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // code to get data from db
        return _.find(books, { id: args.id });
      }
    },
    author: {
        type: AuthorType,
        args : {id:{type:GraphQLID}},
        resolve(parent, args){
            return _.find(authors, { id: args.id });
        }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
