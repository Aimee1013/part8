import SetBirthyear from "./SetBirthyear";

const Authors = (props) => {
  const authors = props.authors;
  console.log("author app", authors);

  if (!props.show) {
    return null;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SetBirthyear
        names={authors.map((a) => a.name)}
        setError={props.setError}
      />
    </div>
  );
};

export default Authors;
