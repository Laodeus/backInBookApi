const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList
} = graphql // extract the function GraphQLObjectType from the packqge graphql

const queries = require('./../../js/queries')
const authVerif = require('./../../js/authverif') // when this is called, when the token or the role is incorect, it stop everything and trhow an error :D
const passphrase = process.env.passphrase || 'maPassPhraseEnDurSuperSecure'

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    blanket: { type: GraphQLString },
    lang: { type: GraphQLString },
    format_book: { type: GraphQLString },
    genre: { type: GraphQLString },
    ISBN: { type: GraphQLString },
    author: {
      type: AuthorType,
      async resolve (parent, args, ctx) {
        // code to get data from db
        await authVerif(ctx, passphrase, ['user', 'admin']) // securisation
        const query = await queries.author(parent.author_id)
        return query
      }
    },
    comment: {
      type: GraphQLList(CommentType),
      async resolve (parent, args) {
        const query = await queries.commentsByBookId(parent.id)
        return query
      }
    },
    borrower_id: { type: GraphQLID },
    borrower_date: { type: GraphQLString },
    state: { type: GraphQLString }
  })
})

module.exports = BookType

// nedded type inclusion for recursivity
const AuthorType = require('./../author/authortype')
const CommentType = require('./../comment/commentType')
