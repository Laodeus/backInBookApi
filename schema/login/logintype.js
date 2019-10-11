const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
} = graphql; // extract the function GraphQLObjectType from the packqge graphql
const _ = require("lodash");



const LoginType = new GraphQLObjectType({
    name: "Login",
    fields: () => ({
      email: { type: GraphQLID },
      name: { type: GraphQLString },
      role: { type: GraphQLString },
      id: { type: GraphQLID },
      token : { type: GraphQLString }
    })
  });

  module.exports = LoginType;