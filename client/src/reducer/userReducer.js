const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_INFO":
      return { ...state, userInfo: action.payload };

    case "SET_CURRENT_CHAT":
      return { ...state, currentChat: action.payload };

    case "RESET_STATES":
      return { userInfo: {}, loading: false, currentChat: {} };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

export default reducer;
