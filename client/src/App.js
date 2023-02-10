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
    if (!userInfo.length <= 0) {
      return (
        <Navigate
          replace={true}
          to="/"
        />
      );
    }
    return children;
  };

  const Public = ({ children }) => {
    console.log(userInfo);
    if (!userInfo.length <= 0) {
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
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/chats"
          element={<Chats />}
        />
      </Routes>
    </Router>
  );
}

export default App;
