import React, { createContext, useContext, useReducer } from "react";

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();

const initialState = {
  leaveTime: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LEAVE_TIME":
      return {
        ...state,
        leaveTime: action.payload,
      };
    case "RESET_LEAVE_TIME":
      return {
        ...state,
        leaveTime: "",
      };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
export const useGlobalDispatch = () => useContext(GlobalDispatchContext);
