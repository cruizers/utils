import { useReducer, useCallback } from "react";
import { ProcessedImage } from "./useImageManager";

interface UIState {
  isDragOver: boolean;
  isProcessing: boolean;
  addCardDragOver: boolean;
  fullscreenImage: ProcessedImage | null;
}

type UIAction =
  | { type: "SET_DRAG_OVER"; payload: boolean }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_ADD_CARD_DRAG_OVER"; payload: boolean }
  | { type: "SET_FULLSCREEN_IMAGE"; payload: ProcessedImage | null };

const initialState: UIState = {
  isDragOver: false,
  isProcessing: false,
  addCardDragOver: false,
  fullscreenImage: null,
};

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "SET_DRAG_OVER":
      return { ...state, isDragOver: action.payload };
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload };
    case "SET_ADD_CARD_DRAG_OVER":
      return { ...state, addCardDragOver: action.payload };
    case "SET_FULLSCREEN_IMAGE":
      return { ...state, fullscreenImage: action.payload };
    default:
      return state;
  }
}

export function useUIState() {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const setDragOver = useCallback((value: boolean) => {
    dispatch({ type: "SET_DRAG_OVER", payload: value });
  }, []);

  const setProcessing = useCallback((value: boolean) => {
    dispatch({ type: "SET_PROCESSING", payload: value });
  }, []);

  const setAddCardDragOver = useCallback((value: boolean) => {
    dispatch({ type: "SET_ADD_CARD_DRAG_OVER", payload: value });
  }, []);

  const setFullscreenImage = useCallback((image: ProcessedImage | null) => {
    dispatch({ type: "SET_FULLSCREEN_IMAGE", payload: image });
  }, []);

  return {
    ...state,
    setDragOver,
    setProcessing,
    setAddCardDragOver,
    setFullscreenImage,
  };
}
