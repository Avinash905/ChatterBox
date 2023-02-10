import "./styles/app.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Chats from "./pages/Chats";
import AppContext from "./context/userContext";
import { useContext } from "react";

function App() {
  const { userInfo } = useContext(AppContext);

  const Protected = ({ children }) => {
    if (!localStorage.getItem("token")) {
      return (
        <Navigate
          replace={true}
          to="/"
        ></Navigate>
      );
    }
    return children;
  };

  const Public = ({ children }) => {
    if (!localStorage.getItem("token")) {
      return children;
    }
    return (
      <Navigate
        replace={true}
        to="/chats"
      />
    );
  };

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <Public>
              <Login />
            </Public>
          }
        />
        <Route
          path="/register"
          element={
            <Public>
              <Register />
            </Public>
          }
        />
        <Route
          path="/chats"
          element={
            <Protected>
              <Chats />
            </Protected>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
