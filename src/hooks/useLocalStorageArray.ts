import { useEffect, useState } from "react";

const useLocalStorageArray = <T>(key: string, defaultValue: T[]) => {
  const storedString = localStorage.getItem(key);
  const parsedValue = storedString
    ? (JSON.parse(storedString) as T[])
    : defaultValue;
  const [array, setArray] = useState<T[]>(parsedValue);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(array));
  }, [key, array]);
  return [array, setArray] as const;
};

export default useLocalStorageArray;
