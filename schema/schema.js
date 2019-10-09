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
    role: "user",
    id: "3"
  }
];

let comment = [
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
    isbn: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.author_id });
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
  fields: () => {}
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
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    }
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
      resolve(parent, args) {
        authors.push({
          id: authors.length + 1,
          name: args.name,
          age: args.age
        });
        console.log(authors[authors.length - 1]);
        return authors[authors.length - 1];
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
