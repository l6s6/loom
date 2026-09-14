function App() {
  const fetchAPIGet = () => {
    fetch('http://localhost:8000/notes')
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.error(error));
  }


  return (
        <button
        type="button"
        className="counter"
        onClick={fetchAPIGet}
      >
        Fetch API GET Notes
      </button>
  )
}

export default App
