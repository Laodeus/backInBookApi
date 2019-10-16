const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql // extract the function GraphQLObjectType from the packqge graphql
const _ = require('lodash')
const { DateTime } = require('luxon')

const queries = require('./../../js/queries')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    id: { type: GraphQLID },
    comment: {
      type: GraphQLList(CommentType),
      async resolve (parent, args) {
        const query = await queries.commentsByUserId(parent.id)
        return query
      }
    },
    borrowed: {
      type: GraphQLList(BookType),
      async resolve (parent, args) {
        const query = await queries.booksByBorrowerId(parent.id)
        return query
      }
    },
    lateReturned: {
      type: GraphQLList(BookType),
      async resolve (parent, args) {
        const allBorrowed = await queries.commentsByUserId(parent.id)
        const allOutDated = _.filter(allBorrowed, (element) => {
          const ElementBorrowDate = DateTime.fromISO(element.borrower_date)
          if (ElementBorrowDate.diffNow(['days', 'hours']).toObject().days <= -30) {
            return element
          }
        })
        return allOutDated
      }
    }
  })
})

module.exports = UserType

// nedded type inclusion for recursivity
const CommentType = require('./../comment/commentType')
const BookType = require('./../book/booktype')
