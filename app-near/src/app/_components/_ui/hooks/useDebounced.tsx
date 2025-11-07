import { useEffect, useState } from "react";

export const useDebounced = <TInput,>(input: TInput, delay = 300) => {
  const [debouncedInput, setDebouncedInput] = useState(input);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedInput(input), delay);
    return () => clearTimeout(timer);
  }, [input, delay]);

  return debouncedInput;
};
