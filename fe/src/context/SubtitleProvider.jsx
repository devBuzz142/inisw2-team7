import { createContext, useContext, useReducer } from "react";

const SubtitleContext = createContext();
export const useSubtitleContext = () => useContext(SubtitleContext);

const initialState = {
  selected: { frame: 1, scene: 1 },
  subtitles: [],
  frameCount: 0,
  zipUrl: "",
  resultUrl: "",
};

const subtitleReducer = (state, action) => {
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
    case "SET_FRAME_COUNT":
      return {
        ...state,
        frameCount: action.payload,
      };
    case "SET_ZIP_URL":
      return {
        ...state,
        zipUrl: action.payload,
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

const SubtitleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subtitleReducer, initialState);

  return (
    <SubtitleContext.Provider
      value={{
        state,
        dispatch,
      }}>
      {children}
    </SubtitleContext.Provider>
  );
};

export default SubtitleProvider;
