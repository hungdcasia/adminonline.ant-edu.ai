import { useEffect } from "react";

const useFocus = ref => {
  const focusRef = ref;

  useEffect(() => {
    if (focusRef && focusRef.current && focusRef.current.focus) {
      focusRef.current.focus();
    }
  }, [focusRef]);

  return focusRef;
};

export default useFocus;