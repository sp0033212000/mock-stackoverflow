import React, { useCallback, useEffect, useState } from "react";

import clsx from "clsx";

import { isBrowser } from "react-use/lib/misc/util";

import Portal from "@/components/common/Portal";

import Flexbox from "@/components/layout/Flexbox";

interface Props extends ElementProps<"div"> {
  zIndex?: number;
  show: boolean;
  onBackDrop?: React.MouseEventHandler<HTMLDivElement>;
}

const Modal: FC<Props> = ({
  children,
  zIndex = 100,
  className,
  show,
  onBackDrop,
  ...props
}) => {
  const [innerShow, setInnerShow] = useState<boolean>(false);

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!show) return;
    const id = requestAnimationFrame(() => setInnerShow(true));

    return () => cancelAnimationFrame(id);
  }, [show]);

  const settingWindow = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    settingWindow();
    window.addEventListener("resize", settingWindow);
    window.addEventListener("orientationchange", settingWindow);

    return () => {
      window.removeEventListener("resize", settingWindow);
      window.removeEventListener("orientationchange", settingWindow);
    };
  }, []);

  const onTransitionEnd = useCallback(() => {
    if (show) return;
    setInnerShow(false);
  }, [show]);

  if (!isBrowser || (!innerShow && !show)) return null;

  return (
    <Portal>
      <Flexbox
        id={"modal-wrapper"}
        className={clsx(
          "h-stretch",
          "transition-opacity duration-500",
          "bg-black bg-opacity-[64%]",
          {
            "opacity-100": innerShow,
            "opacity-0": !show || !innerShow,
          }
        )}
        style={{
          width,
          height: "stretch",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex,
        }}
        onTransitionEnd={onTransitionEnd}
        onClick={onBackDrop}
        {...props}
      >
        <Flexbox
          align={"center"}
          justify={"center"}
          id={"modal"}
          className={clsx(className, "relative", "w-full", "z-50")}
        >
          {children}
        </Flexbox>
      </Flexbox>
    </Portal>
  );
};

export default Modal;
