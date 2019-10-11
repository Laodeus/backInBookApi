const jsonWebToken = require("jsonwebtoken");
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

// all type
const BookType = require("./book/booktype");
const AuthorType = require("./author/authortype");
const UserType = require("./comment/commentType");
const CommentType = require("./comment/commentType");
const LoginType = require("./login/logintype");


// all Data
const {books,authors,users,comments} = require("./../js/dummydata/dummy");
/*
  a faire
  une query dans user qui recupere tous les bouquins emprunter par l'utilisateur.
  l'isbn n'est pas unique c'est l'id qui l'est, un bouquin, un id.
  faire un systeme d'historique d'emprunt

*/

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        // code to get data from db
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return _.find(books, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',"all"); // securisation 
        return books;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return _.find(authors, { id: args.id });
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return authors;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',"all"); // securisation 
        return _.find(users, { id: args.id });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return users;
      }
    },
    comment: {
      type: CommentType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return _.find(comments, { id: args.id });
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return comments;
      }
    },
    login: {
      type: LoginType,
      args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
      resolve(parent, args, ctx) {
        const user = _.find(users, { email: args.email, password: args.password } );
        if(user){
          user.token = jsonWebToken.sign({id: user.id, role: user.role},'maPassPhraseEnDurSuperSecure');
          return user;
        }
        else{
          throw new Error("Login Failed");
        }
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["admin"]); // securisation 
        authors.push({
          id: authors.length + 1,
          name: args.name
        });
        console.log(authors[authors.length - 1]);
        return authors[authors.length - 1];
      }
    },
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
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["admin"]); // securisation 
        if (args.author_id && args.title && args.ISBN) {
          if (_.find(authors, { id: args.author_id })) {
            console.log(Object.entries(args))
            books.push({
              id: books.length,
              title: args.title||null,
              subtitle: args.subtitle,
              blanket: args.blanket,
              lang: args.lang,
              format_book: args.format_book,
              genre: args.genre,
              stock: args.stock,
              ISBN: args.ISBN,
              author_id : args.author_id
            });
            return books[books.length - 1];
          } else {
            throw new Error("Unknow author");
          }
        } else {
          throw new Error("ISBN, Title or author can not be unset");
        }
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
        stock: { type: GraphQLInt },
        ISBN: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        const authUser =await  authVerif(ctx,'maPassPhraseEnDurSuperSecure',["admin"]); // securisation 
        let modifiedBook = Object.assign(
          [_.findIndex(books, { id: args.id })], 
          args.name&&{name : args.name},
          args.title&&{ title: args.title },
          args.subtitle&&{ subtitle: args.subtitle },
          args.blanket&&{ blanket: args.blanket },
          args.lang&&{ lang: args.lang },
          args.format_book&&{ format_book: args.format_book },
          args.genre&&{ genre: args.genre },
          args.stock&&{ stock: args.stock },
          args.ISBN&&{ ISBN: args.ISBN }
          ); 
        books[_.findIndex(books, { id: args.id })] = modifiedBook;
        return _.find(books, { id: args.id });
      }
    },
    signUp: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args, ctx) {
        if (args.email && args.password) {
          if (!_.find(users, { email: args.email })) {
            users.push({
              id: users.length,
              email:args.email,
              name:args.name || null,
              password:args.password,
              role : "user"
            });
            return users[users.length - 1];
          } else {          
            throw new Error("email already use");
          }
        } else {
          throw new Error("password or email can not be unset");
        }
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLID },
        email: { type: GraphQLID },
        password: { type: GraphQLID },
      },
      async resolve(parent, args, ctx) {
        const authUser =await  authVerif(ctx,'maPassPhraseEnDurSuperSecure',["admin","user"]); // securisation 
        if(authUser.id == args.id || authUser.role == "admin"){ // si c'est un admin ou lui meme
          let modifiedUser = Object.assign(users[_.findIndex(users, { id: args.id })], args.name&&{name : args.name}, args.email&&{email: args.email}, args.password&&{password:args.password}); 
          users[_.findIndex(users, { id: args.id })] = modifiedUser;
          return _.find(users, { id: args.id });
        }
        else{
          throw new Error("unauthorised for non-admin or not your own account");
        }
      }
    },
    editUserRole: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
         role : { type: GraphQLString }
       },
       async resolve(parent, args, ctx) {
         authUser =await  authVerif(ctx,'maPassPhraseEnDurSuperSecure',["admin"]); // securisation 
           let modifiedUser = Object.assign(users[_.findIndex(users, { id: args.id })], args.role&&{role:args.role}); 
           users[_.findIndex(users, { id: args.id })] = modifiedUser;
           return _.find(users, { id: args.id });
       }
     },
     // borrowABook:{

     // },
     // returnABook:{

     // }
     // creer les routes pour les commentaire et les roote pour que l'utilisateur voit les livres qu'il a emprunter
   }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
