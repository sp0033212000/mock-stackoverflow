import { useCallback, useEffect, useRef } from "react";

import { isBrowser } from "@chakra-ui/utils";
import throttle from "lodash/throttle";

interface OnEndReached {
  (event: WheelEvent | TouchEvent): void;
}

const useOnEndReached = ({
  onEndReached,
  disabled,
  wait = 1000,
}: {
  onEndReached: OnEndReached;
  disabled?: boolean;
  wait?: number;
}) => {
  const reached = useRef(onEndReached);
  const throttledOnEndReached = useRef(
    throttle((event: WheelEvent | TouchEvent) => reached.current(event), wait)
  );

  useEffect(() => {
    return () => {
      throttledOnEndReached.current.cancel();
    };
  }, []);

  useEffect(() => {
    reached.current = onEndReached;
  }, [onEndReached]);

  const _onEndReached = useCallback((event: WheelEvent | TouchEvent) => {
    if (!isBrowser) return;

    const { innerHeight } = window;
    const scrollTop = document.querySelector("html")?.scrollTop ?? 0;
    const scrollHeight = document.querySelector("html")?.scrollHeight ?? 0;

    const isReached = innerHeight + scrollTop >= scrollHeight;
    if (isReached) {
      requestAnimationFrame(() => throttledOnEndReached.current(event));
    }
  }, []);

  useEffect(() => {
    if (disabled) return;
    if (!isBrowser) return;
    const html = document.querySelector("html")!;
    const touchable = window.navigator.maxTouchPoints > 0;

    if (touchable) {
      html.addEventListener("touchmove", _onEndReached);
    } else {
      html.addEventListener("wheel", _onEndReached);
    }

    return () => {
      if (touchable) {
        html.removeEventListener("touchmove", _onEndReached);
      } else {
        html.removeEventListener("wheel", _onEndReached);
      }
    };
  }, [disabled]);
};

export default useOnEndReached;
