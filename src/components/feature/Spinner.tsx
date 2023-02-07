import React, { useEffect, useState } from "react";

import { Spinner as SpinnerIcon } from "@chakra-ui/react";

import { loadingEventEmitter } from "@/event";

import Modal from "@/components/common/Modal";


const Spinner = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadingEventEmitter.on(setIsLoading);

    return () => {
      loadingEventEmitter.off(setIsLoading);
    };
  }, []);

  return (
    <Modal show={isLoading} zIndex={9999} className={"text-white"}>
      <SpinnerIcon
        width={"3rem"}
        height={"3rem"}
        borderWidth={"4px"}
        // borderColor={"white"}
      />
    </Modal>
  );
};

export default Spinner;
