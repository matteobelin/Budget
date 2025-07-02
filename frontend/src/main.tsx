import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Router from "./components/Router";
import "./index.css"

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}