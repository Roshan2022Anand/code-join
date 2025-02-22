import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePg from "./pages/HomePg.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
//@ts-ignore
import "./index.css";
import Dashboard from "./pages/Dashboard.tsx";
import ContextProvider from "./components/ContextProvider.tsx";
import { Bounce, ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/home", element: <HomePg /> },
  { path: "/dashboard", element: <Dashboard /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={true}
      rtl={false}
      pauseOnHover
      theme="dark"
      transition={Bounce}
    />
    <ContextProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ContextProvider>
  </StrictMode>
);
