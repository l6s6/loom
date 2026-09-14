function App() {
  const fetchAPIGet = () => {
    fetch('http://localhost:8000/notes')
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.error(error));
  }


  return (
      <div>

        <button
        type="button"
        className="counter"
        onClick={fetchAPIGet}
      >
        Fetch API GET Notes
      </button>
          <h1 className="text-3xl font-bold text-blue-600">Test</h1>
      </div>
  )
}

export default App
