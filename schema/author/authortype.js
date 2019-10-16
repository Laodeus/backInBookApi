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

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      async resolve (parent, args, ctx) {
        await authVerif(ctx, passphrase, ['user', 'admin']) // securisation
        const query = await queries.booksById(parent.id)
        return query
      }
    }
  })
})
module.exports = AuthorType

// nedded type inclusion for recursivity
const BookType = require('./../book/booktype')
