import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const SetBirthyear = ({ names, setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  console.log("names", names);

  const [changeBorn, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      const messages = error.graphQLErrors[0].message;
      setError(messages);
    },
  });

  const submitBirthyear = (e) => {
    e.preventDefault();

    changeBorn({ variables: { name, born: parseInt(born) } });

    setName("");
    setBorn("");
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError("author not found");
    }
  }, [result.data, setError]);

  return (
    <div>
      <h3>SetBirthyear</h3>
      <form onSubmit={submitBirthyear}>
        <div>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {names.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {/* <div>
          name{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />{" "}
        </div> */}
        <div>
          born{" "}
          <input
            type="number"
            value={born}
            onChange={(e) => {
              setBorn(e.target.value);
            }}
          />{" "}
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default SetBirthyear;
