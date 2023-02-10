import { createContext, useEffect, useReducer } from "react";
import reducer from "../reducer/userReducer";

const AppContext = createContext();

const initialState = {
  userInfo: {},
  loading: false,
  currentChat: {},
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setUserInfo = (info) => {
    return dispatch({ type: "SET_USER_INFO", payload: info });
  };

  const setCurrentChat = (info) => {
    return dispatch({ type: "SET_CURRENT_CHAT", payload: info });
  };

  const setLoading = (info) => {
    return dispatch({ type: "SET_LOADING", payload: info });
  };

  const resetStates = () => {
    return dispatch({ type: "RESET_STATES" });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUserInfo,
        setLoading,
        resetStates,
        setCurrentChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
export { AppProvider };
