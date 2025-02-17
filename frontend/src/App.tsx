import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <header></header>
      <main className="w-2/3 h-2/3 mx-auto mt-10">
        <Link to="/dashboard">dashboard</Link>
      </main>
    </>
  );
}

export default App;
