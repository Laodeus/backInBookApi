const jsonWebToken = require("jsonwebtoken");
const { DateTime } = require("luxon");
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
const authVerif = require("./../js/authverif"); // when this is called, when the token or the role is incorect, it stop everything and trhow an error :D

const passphrase = process.env.passphrase || "maPassPhraseEnDurSuperSecure";

// all type
const BookType = require("./book/booktype");
const AuthorType = require("./author/authortype");
const UserType = require("./user/usertype");
const CommentType = require("./comment/commentType");
const LoginType = require("./login/logintype");

// all Data
// import nedded data
let books = require("./../js/dummydata/books");
let users = require("./../js/dummydata/users");
let authors = require("./../js/dummydata/authors");
let comments = require("./../js/dummydata/comments");

let queries = require("./../js/queries");
let mutationQueries = require("./../js/mutationQueries");

/*
  a faire
  faire un systeme d'historique d'emprunt
  le systeme de commentaire
*/

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        // code to get data from db
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        const query = await queries.book(args.id);
        return query;
      }
    },
    books: {
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      type: new GraphQLList(BookType),
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset ? parseInt(args.offset) : 0;
        limit = args.limit ? parseInt(args.limit) : 10;
        const query = await queries.books(limit, offset);
        return query;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        const query = await queries.author(args.id);
        return query;
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset ? parseInt(args.offset) : 0;
        limit = args.limit ? parseInt(args.limit) : 10;
        const query = await queries.authors(limit, offset);
        return query;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        const query = await queries.user(args.id);
        return query;
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset ? parseInt(args.offset) : 0;
        limit = args.limit ? parseInt(args.limit) : 10;
        const query = await queries.users(limit, offset);
        return query;
      }
    },
    whoAmI: {
      type: UserType,
      async resolve(parent, args, ctx) {
        const authUser = await authVerif(ctx, passphrase, "all"); // securisation
        const query = await queries.user(authUser.id);
        return query;
      }
    },
    comment: {
      type: CommentType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        const query = await queries.comment(args.id);
        return query;
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset ? parseInt(args.offset) : 0;
        limit = args.limit ? parseInt(args.limit) : 10;
        const query = await queries.comments(limit, offset);
        return query;
      }
    },
    login: {
      type: LoginType,
      description: `All queries except login(queries) and signUp(mutation) are protected. 
      you must login before anything.`,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["public"]); // securisation
        const user = await queries.login(args.email, args.password);
        console.log(user[0]);

        user[0].token = jsonWebToken.sign(
          { id: user[0].id, role: user[0].role },
          passphrase
        );
        return user[0];
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: `signUp // free access.
  addBooks // admin role only
  editBook // admin role only
  deleteBook // admin role only
  borrowABook // admin role only
  returnABook // admin role only
  addAuthor // admin role only
  editUser // admin role or user himself only
  editUserRole // admin role only
  addComment // admin and user access. 
  deleteComment // admin role or user himself only
  `,
  fields: {
    addBooks: {
      type: BookType,
      args: {
        author_id: { type: GraphQLID },
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        blanket: { type: GraphQLString },
        lang: { type: GraphQLString },
        format_book: { type: GraphQLString },
        genre: { type: GraphQLString },
        stock: { type: GraphQLInt },
        ISBN: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["admin"]); // securisation
        if (!args.author_id && !args.title && !args.ISBN) {
          throw new Error("ISBN, Title or author can not be unset");
        }

        mutationQueries.insertIntoBooks(args);
      }
    },
    editBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        author_id: { type: GraphQLID },
        title: { type: GraphQLString },
        subtitle: { type: GraphQLString },
        blanket: { type: GraphQLString },
        lang: { type: GraphQLString },
        format_book: { type: GraphQLString },
        genre: { type: GraphQLString },
        ISBN: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        const authUser = await authVerif(ctx, passphrase, ["admin"]); // securisation
        const result = mutationQueries.updateIntoBooks(args);
        return result;
      }
    },
    deleteBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["admin"]); // securisation
        const result = await mutationQueries.deleteIntoBooks(args);
        console.log(result);
        return result;
      }
    },
    borrowABook: {
      type: GraphQLList(BookType),
      args: {
        bookId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, ["admin"]); // securisation
        const result = await mutationQueries.borrowABook(args);

        return result;
      }
    },
    returnABook: {
      type: GraphQLList(BookType),
      args: {
        bookId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, ["admin"]); // securisation
        const result = await mutationQueries.returnABook(args);
        return result;
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, ["admin"]); // securisation
        const result = await mutationQueries.addAuthor(args);
        return result;
      }
    },
    signUp: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["public"]); // securisation
        const result = await mutationQueries.signUp(args);
        return result;
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLID },
        email: { type: GraphQLID },
        password: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        const authUser = await authVerif(ctx, passphrase, ["admin", "user"]); // securisation

        const result = await mutationQueries.editUser(args, authUser);
        return result.rows;
      }
    },
    editUserRole: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        role: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, ["admin"]); // securisation
        const result = await mutationQueries.editUserRole(args);
        return result.rows;
      }
    },
    addComment: {
      type: CommentType,
      args: {
        bookId: { type: GraphQLID },
        title: { type: GraphQLString },
        comment: { type: GraphQLString },
        eval: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, ["admin", "user"]); // securisation
        const result = await mutationQueries.addComment(args, authUser);
        return result;
      }
    },
    deleteComment: {
      type: GraphQLList(CommentType),
      args: {
        id: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, ["admin", "user"]); // securisation
        
        const result = await mutationQueries.deleteIntocomments(args,authUser);
        console.log(result)
        return result.rows;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
