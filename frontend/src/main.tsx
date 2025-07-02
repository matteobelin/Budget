import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import Router from "./component/Router";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}