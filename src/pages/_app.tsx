import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

import { StackoverflowContextProvider } from "@/context/stackoverflowContext";

import Spinner from "@/components/feature/Spinner";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <StackoverflowContextProvider>
        <Spinner />
        <Component {...pageProps} />
      </StackoverflowContextProvider>
    </ChakraProvider>
  );
}
