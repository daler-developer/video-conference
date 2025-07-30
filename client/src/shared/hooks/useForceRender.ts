import { useState, useCallback } from "react";

const useForceRender = () => {
  const [, setTick] = useState(0);
  return useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
};

export default useForceRender;
