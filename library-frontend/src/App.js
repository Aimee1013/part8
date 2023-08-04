import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "./queries";
import { ALL_BOOKS } from "./queries";
import Notify from "./components/Notify";

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState("authors");
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  console.log("authorsResult", authorsResult);
  console.log("booksResult", booksResult);

  const authors = authorsResult?.data?.allAuthors || [];
  const books = booksResult?.data?.allBooks || [];

  if (authorsResult.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Notify errorMessage={errorMessage} />
      <Authors show={page === "authors"} authors={authors} setError={notify} />
      <Books show={page === "books"} books={books} />
      <NewBook show={page === "add"} setError={notify} />
    </div>
  );
};

export default App;
