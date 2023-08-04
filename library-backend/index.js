const { ApolloServer, gql, UserInputError } = require("apollo-server");
const { v1: uuid } = require("uuid");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");

require("dotenv").config();
const MONGODB_URL = process.env.MONGODB_URL;
console.log("connected to", MONGODB_URL);

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("connected to MONGODB");
  })
  .catch((error) => {
    console.log("error connection to mongodb:", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = gql`
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
    editAuthor(name: String!, born: Int!): Author
  }

  type Author {
    name: String!
    bookCount: Int!
    born: Int
    id: ID!
  }

  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
`;

const resolvers = {
  Query: {
    // bookCount: () => books.length,
    bookCount: async () => Book.collection.countDocuments(),
    // authorCount: () => authors.length,
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, args) => getAllBooks(args),
    allAuthors: () => getAllAuthors(),
    // allAuthors: async () => {
    //   books = await Book.find();
    //   return Author.find({});
    // },
  },
  Author: {
    bookCount: async (root) => {
      return books.filter((book) => book.author === root.name).length;
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      if (books.find((book) => book.title === args.title)) {
        throw new UserInputError("Title must be unique", {
          invalidArgs: args.title,
        });
      }
      const book = { ...args, id: uuid() };
      books = books.concat(book);
      return book;

      // const book = new Book({ ...args });
      // return book.save();
    },
    editAuthor: (root, args) => {
      const author = authors.find((author) => author.name === args.name);
      // const author = Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      // console.log("123", author, args);

      const updatedAuthor = { ...author, name: args.name, born: args.born };
      authors = authors.map((author) =>
        author.name === args.name ? updatedAuthor : author
      );
      console.log(authors);
      return author;

      // author.born = args.born;
      // return author.save();
    },
  },
};

getAllAuthors = () => {
  return authors.map((author) => ({
    ...author,
    bookCount: books.filter((book) => book.author === author.name).length,
  }));
};

getAllBooks = (args) => {
  let filteredBooks = books;
  if (args.genre) {
    filteredBooks = filteredBooks.filter((book) =>
      book.genres.includes(args.genre)
    );
  }

  if (args.author) {
    filteredBooks = filteredBooks.filter((book) => book.author === args.author);
  }

  return filteredBooks;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
