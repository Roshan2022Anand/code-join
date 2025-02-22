// import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useAuth } from "./utility/Hooks";
function App() {
  useAuth();
  return (
    <>
      <header></header>
      <main className="w-2/3 h-2/3 mx-auto mt-10">
        <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/github`}>
          <FaGithub className="icon-lg" />
        </a>
      </main>
    </>
  );
}

export default App;
