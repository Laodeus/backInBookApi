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

//dummy data
let books = [
  {
    id: "1",
    author_id: "1",
    title: "indiana jones",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  },
  {
    id: "2",
    author_id: "5",
    title: "indiana",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  },

  {
    id: "3",
    author_id: "4",
    title: "jones",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  },

  {
    id: "4",
    author_id: "1",
    title: "flagada jones",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  },

  {
    id: "5",
    author_id: "2",
    title: "bones",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  },

  {
    id: "6",
    author_id: "1",
    title: "mabite",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  },

  {
    id: "7",
    author_id: "2",
    title: "tatatat",
    subtitle: "",
    blanket: "",
    lang: "",
    format_book: "",
    genre: "shit",
    authorId: "1",
    genre: "",
    stock: 0,
    ISBN: ""
  }
];

let authors = [
  { name: "robert mabite", id: "1" },
  { name: "madeleine taChate", id: "2" },
  { name: "Robert k. dick", id: "3" },
  { name: "stephen king", id: "4" },
  { name: "marina nal", id: "5" }
];

let users = [
  {
    email: "admin@admin.admin",
    name: "laodeus",
    password: "0000",
    role: "admin",
    id: "1"
  },
  {
    email: "gamin@petit.lol",
    name: "dylan",
    password: "1234",
    role: "user",
    id: "2"
  },
  {
    email: "keke@baraki.con",
    name: "kevin",
    password: "5678",
    role: "banned",
    id: "3"
  }
];

let comments = [
  {
    id: "1",
    book_id: "7",
    user_id: "1",
    title: "ok",
    com: "c'est pas mal",
    eval: "5"
  },
  {
    id: "2",
    book_id: "7",
    user_id: "3",
    title: "nope",
    com: "C'est de la merde",
    eval: "2"
  },
  {
    id: "3",
    book_id: "2",
    user_id: "2",
    title: "null de chez null",
    com: "c'est a chier....vraimeent",
    eval: "1"
  },
  {
    id: "4",
    book_id: "4",
    user_id: "2",
    title: "balec",
    com: "balec",
    eval: "3"
  }
];

// all type
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    blanket: { type: GraphQLString },
    lang: { type: GraphQLString },
    format_book: { type: GraphQLString },
    genre: { type: GraphQLString },
    stock: { type: GraphQLInt },
    ISBN: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.author_id });
      }
    },
    comment: {
      type: GraphQLList(CommentType),
      resolve(parent, args) {
        return _.filter(comments, { book_id: parent.id });
      }
    }
  })
});
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
const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: { type: GraphQLID },
    book: {
      type: BookType,
      resolve(parent, args) {
        return _.find(books, { id: parent.book_id });
      }
    },
    user: {
      type: UserType,
      resolve(parent, args) {
        console.log();
        return _.find(users, { id: parent.user_id });
      }
    },
    title: { type: GraphQLString },
    com: { type: GraphQLString },
    eval: { type: GraphQLString }
  })
});
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
      async resolve(parent, args) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return books;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return _.find(authors, { id: args.id });
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      async resolve(parent, args) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return authors;
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return _.find(users, { id: args.id });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return users;
      }
    },
    comment: {
      type: CommentType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        await authVerif(ctx,'maPassPhraseEnDurSuperSecure',["user", "admin"]); // securisation 
        return _.find(comments, { id: args.id });
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      async resolve(parent, args) {
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
          throw new error("Login Failed");
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
      async resolve(parent, args) {
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
      async resolve(parent, args) {
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
    signUp: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        name: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
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

    },
    bannishAUser:{

    },
    borrowABook:{

    },
    returnABook:{

    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
