const jsonWebToken = require("jsonwebtoken");
const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");
const { DateTime } = require("luxon");


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
        return _.filter(comments, { user_id: parent.id });
      }
    },
    borrowed: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { borrower_id: parent.id });
      }
    },
    lateReturned: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        const allBorrowed = _.filter(books, { borrower_id: parent.id });
        let allOutDated = _.filter(allBorrowed, (element)=>{
        console.log(`for element => ${element.title}, borow date ${element.borrower_date}`);
        ElementBorrowDate = DateTime.fromISO(element.borrower_date);
        if (ElementBorrowDate.diffNow(["days", "hours"]).toObject().days <= -30) {
            console.log(`this element is late => ${element.title}`)
            return element
        }
        });
        return allOutDated;
      }
    }
  })
});

module.exports = UserType;

// nedded type inclusion for recursivity
const CommentType = require("./../comment/commentType");
const BookType = require("./../book/booktype");

// import nedded data
const books = require("./../../js/dummydata/books");
const users = require("./../../js/dummydata/users");
const authors = require("./../../js/dummydata/authors");
const comments = require("./../../js/dummydata/comments");
