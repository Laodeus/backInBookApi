const jsonWebToken = require("jsonwebtoken");
const { DateTime } = require("luxon");
const graphql = require("graphql");
const {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList} = graphql; // extract the function GraphQLObjectType from the packqge graphql
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
        return _.find(books, { id: args.id });
      }
    },
    books: {
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      type: new GraphQLList(BookType),
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, "all"); // securisation
        offset = args.offset?parseInt(args.offset):0;
        limit = args.limit?parseInt(args.limit):10;

        return books.slice(offset,offset+limit);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        return _.find(authors, { id: args.id });
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset?parseInt(args.offset):0;
        limit = args.limit?parseInt(args.limit):10;

        return authors.slice(offset,offset+limit);
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, "all"); // securisation
        return _.find(users, { id: args.id });
      }
    },
    users: {
      type: new GraphQLList(UserType),
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset?parseInt(args.offset):0;
        limit = args.limit?parseInt(args.limit):10;

        return users.slice(offset,offset+limit);
      }
    },
    whoAmI:{
      type: UserType,
      async resolve(parent, args, ctx) {
        const authUser = await authVerif(ctx, passphrase, "all"); // securisation
        return _.find(users, { id: authUser.id });
      }
    },
    comment: {
      type: CommentType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        return _.find(comments, { id: args.id });
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      args: { offset: { type: GraphQLID }, limit: { type: GraphQLInt } },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["user", "admin"]); // securisation
        offset = args.offset?parseInt(args.offset):0;
        limit = args.limit?parseInt(args.limit):10;

        return comments.slice(offset,offset+limit);
      }
    },
    login: {
      type: LoginType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args, ctx) {
        const user = _.find(users, {
          email: args.email,
          password: args.password
        });
        if (user) {
          user.token = jsonWebToken.sign(
            { id: user.id, role: user.role },
            passphrase
          );
          return user;
        } else {
          throw new Error("Login Failed");
        }
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
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
        if (args.author_id && args.title && args.ISBN) {
          if (_.find(authors, { id: args.author_id })) {
            const lastId = books[books.length-1]?parseInt(books[books.length-1].id) : 0;
            console.log(lastId);
            books.push({
              id: (lastId+1).toString(),
              title: args.title || null,
              subtitle: args.subtitle,
              blanket: args.blanket,
              lang: args.lang,
              format_book: args.format_book,
              genre: args.genre,
              stock: args.stock,
              ISBN: args.ISBN,
              author_id: args.author_id
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
        const authUser = await authVerif(ctx, passphrase, [
          "admin"
        ]); // securisation
        if(!_.some(books, { id: args.id })){
          throw new Error("Unknow book");
        }
        let modifiedBook = Object.assign(
          [_.findIndex(books, { id: args.id })],
          args.name && { name: args.name },
          args.title && { title: args.title },
          args.subtitle && { subtitle: args.subtitle },
          args.blanket && { blanket: args.blanket },
          args.lang && { lang: args.lang },
          args.format_book && { format_book: args.format_book },
          args.genre && { genre: args.genre },
          args.stock && { stock: args.stock },
          args.ISBN && { ISBN: args.ISBN }
        );
        books[_.findIndex(books, { id: args.id })] = modifiedBook;
        return _.find(books, { id: args.id });
      }
    },
    deleteBook: {
      type: GraphQLList(BookType),
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, [
          "admin"
        ]); // securisation
        if(!_.some(books, { id: args.id })){
          throw new Error("Unknow book");
        }
        books.splice(_.findIndex(books, { id: args.id }), 1);
        return books;
      }
    },
    borrowABook: {
      type: GraphQLList(BookType),
      args: {
        bookId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, [
          "admin"
        ]); // securisation
        if (!args.bookId) {
          throw new Error("bookId need to be set.");
        } // not set throw error
        if (!args.userId) {
          throw new Error("userId need to be set.");
        }

        if (!_.some(users, { id: args.userId })) {
          throw new Error("User Not found.");
        } // not finding throw error
        if (!_.some(books, { id: args.bookId })) {
          throw new Error("book Not found.");
        }
        // here comes the other error function.
        // see if the user have more than 5 books and if one of these books have a borrow date  that of more than a month
        const alreadyBorrowed = _.filter(books, { borrower_id: args.userId }); // array of book already borrowed

        const count = alreadyBorrowed.length; // number of book already borrowed
        if (count >= 5) {
          throw new Error("You already have 5 books.");
        }
        const allOutdated = _.filter(alreadyBorrowed, element => {
          // this will filter the already borrowed books and only return the books that outdated
          const ElementBorrowDate = DateTime.fromISO(element.borrower_date); // get the diff from borrowdate and now
          if (
            ElementBorrowDate.diffNow(["days", "hours"]).toObject().days <= -30
          ) {
            // luxon return a negative date difference
            element.state = `id: ${element.id},${element.title}, borrowed ${
              element.borrower_date
            }. ${
              ElementBorrowDate.diffNow(["days", "hours"]).toObject().days
            } days of location`;
            return element;
          }
        });
        if (allOutdated.length > 0) {
          // if there is some oudated
          let err = "";
          allOutdated.forEach(el => {
            err +=
              el.state +
              `
            `;
          });
          throw new Error(err);
        }
        // if the book is already borrowed
        if(!_.some(books, { borrower_id: "",id:args.bookId })){
          throw new Error("Book already borrowed");
        }


        let modifiedBook = Object.assign(
          _.find(books, { id: args.bookId }),
          args.bookId && {
            borrower_id: args.userId,
            borrower_date: DateTime.fromObject(Date.now()).toISODate()
          }
        );
        books[_.findIndex(books, { id: args.bookId })] = modifiedBook;
        return _.filter(books, { borrower_id: args.userId });
      }
    },
    returnABook: {
      type: GraphQLList(BookType),
      args: {
        bookId: { type: GraphQLID },
        userId: { type: GraphQLID },
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, [
          "admin"
        ]); // securisation
        if(!args.bookId){throw new Error("bookId not provided");}
        if(!args.userId){throw new Error("userId not provided");}
        if (!_.some(users, { id: args.userId })) {
          throw new Error("User Not found.");
        } // not finding throw error
        if (!_.some(books, { id: args.bookId })) {
          throw new Error("book Not found.");
        }
        // si le livre est bien a l'user, on le retourne, sinon, on throw une erreur
        if (!_.some(books, { id: args.bookId, borrower_id:args.userId })) {
          throw new Error("This book are not assigned to this user");
        }

        let modifiedBook = Object.assign(
          _.find(books, { id: args.bookId }),
          args.bookId && {
            borrower_id: "",
            borrower_date: ""
          }
        );
        books[_.findIndex(books, { id: args.bookId })] = modifiedBook;

        return _.filter(books, {borrower_id: args.userId})
      }
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, ["admin"]); // securisation
        authors.push({
          id: authors.length + 1,
          name: args.name
        });
        console.log(authors[authors.length - 1]);
        return authors[authors.length - 1];
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
              email: args.email,
              name: args.name || null,
              password: args.password,
              role: "user"
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
        password: { type: GraphQLID }
      },
      async resolve(parent, args, ctx) {
        const authUser = await authVerif(ctx, passphrase, [
          "admin",
          "user"
        ]); // securisation
        if (authUser.id == args.id || authUser.role == "admin") {
          // si c'est un admin ou lui meme
          let modifiedUser = Object.assign(
            users[_.findIndex(users, { id: args.id })],
            args.name && { name: args.name },
            args.email && { email: args.email },
            args.password && { password: args.password }
          );
          users[_.findIndex(users, { id: args.id })] = modifiedUser;
          return _.find(users, { id: args.id });
        } else {
          throw new Error("unauthorised for non-admin or not your own account");
        }
      }
    },
    editUserRole: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        role: { type: GraphQLString }
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, [
          "admin"
        ]); // securisation
        let modifiedUser = Object.assign(
          users[_.findIndex(users, { id: args.id })],
          args.role && { role: args.role }
        );
        users[_.findIndex(users, { id: args.id })] = modifiedUser;
        return _.find(users, { id: args.id });
      }
    },
    addComment: {
      type: CommentType,
      args: {
        bookId: { type: GraphQLID },
        title: { type: GraphQLString },
        comment: { type: GraphQLString },
        eval: { type: GraphQLString },
      },
      async resolve(parent, args, ctx) {
        authUser = await authVerif(ctx, passphrase, [
          "admin",
          "user"
        ]); // securisation
        if(!_.some(books, { id: args.bookId })){
          throw new Error("Unknow book");
        }
        if(!args.title){
          throw new Error("A comment must have a title.");
        }
        if(!args.comment){
          throw new Error("A comment must have a comment to... have a comment...");
        }
        if(!args.eval){
          throw new Error("A comment must have an eval.");
        }
        const lastId = comments[comments.length-1]?parseInt(comments[comments.length-1].id) : 0;

        console.log(authUser.id)
        const newComment = {
          id: (lastId+1).toString(),
          book_id: args.bookId,
          user_id: authUser.id.toString(),
          title: args.title,
          com: args.comment,
          eval: args.eval
        }
        comments.push(newComment);
        return _.find(comments, { id: (lastId+1).toString() });
      }
    },
    deleteComment: {
      type: GraphQLList(CommentType),
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args, ctx) {
        await authVerif(ctx, passphrase, [
          "admin"
        ]); // securisation
        if(!_.some(books, { id: args.id })){
          throw new Error("Unknow book");
        }
        books.splice(_.findIndex(books, { id: args.id }), 1);
        return books;
      }
    },
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
