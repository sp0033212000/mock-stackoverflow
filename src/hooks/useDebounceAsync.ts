import { DependencyList, useEffect, useRef } from "react";
import { useAsyncFn } from "react-use";

import { debounce } from "lodash";

import { FunctionReturningPromise } from "react-use/lib/misc/types";

export default function useDebounceAsync<T extends FunctionReturningPromise>(
  fn: T,
  deps: DependencyList = [],
  wait: number = 1000
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  const cachedCallback = useRef(callback);
  const debouncedCallback = useRef(
    debounce(() => {
      cachedCallback.current();
    }, wait)
  );

  useEffect(() => {
    cachedCallback.current = callback;
    debouncedCallback.current();

    return () => {
      debouncedCallback.current.cancel();
    };
  }, [callback]);

  return state;
}
