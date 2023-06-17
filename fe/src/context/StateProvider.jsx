import { createContext, useContext, useReducer } from "react";

const StateContext = createContext();
export const useStateContext = () => useContext(StateContext);

const initialState = {
  selected: { frame: 1, scene: 1 },
  subtitles: [],
  frames: "",
  resultUrl: "",
};

const stateReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED":
      return {
        ...state,
        selected: action.payload,
      };
    case "SET_SUBTITLES":
      return {
        ...state,
        subtitles: action.payload,
      };
    case "SET_FRAMES":
      return {
        ...state,
        frames: action.payload,
      };
    case "SET_RESULT_URL":
      return {
        ...state,
        resultUrl: action.payload,
      };
    default:
      return state;
  }
};

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <StateContext.Provider
      value={{
        state,
        dispatch,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
