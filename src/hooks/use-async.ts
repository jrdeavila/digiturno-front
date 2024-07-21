import { useEffect } from "react";

const useAsync: <T>(
  asyncFunction: () => Promise<T>,
  onSuccess: (data: T) => void,
  onError: (error: any) => void,
  returnFunction: Function | undefined,
  dependencies: any[]
) => void = (
  asyncFunction,
  onSuccess,
  onError,
  returnFunction,
  dependencies
) => {
  useEffect(() => {
    let active = true;
    asyncFunction()
      .then((data) => {
        if (active) onSuccess(data);
      })
      .catch((error) => {
        if (active) onError(error);
      });
    return () => {
      returnFunction && returnFunction();
      active = false;
    };
  }, dependencies);
};

export default useAsync;
