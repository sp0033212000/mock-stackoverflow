import React from "react";

import { Input, InputGroup } from "@chakra-ui/input";
import Head from "next/head";

import { useStackoverflowContext } from "@/context/stackoverflowContext";

import Questions from "@/components/pages/homepage/Questions";
import Tags from "@/components/pages/homepage/Tags";

const Home: React.FC = () => {
  const { keyword, onKeywordChange } = useStackoverflowContext();

  return (
    <React.Fragment>
      <Head>
        <title>Mock Stackoverflow</title>
        <meta
          name="description"
          content="mock stackoverflow and using stackoverflow-api"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={"w-full h-stretch"}>
        <section className={"fixed z-10 top-0 left-0 w-full bg-white"}>
          <InputGroup className={"px-6 py-4"}>
            <Input
              placeholder={"Search..."}
              value={keyword}
              onChange={onKeywordChange}
            />
          </InputGroup>
        </section>
        <div className={"pt-[4.5rem] px-6"}>
          <Tags />
          <Questions />
        </div>
      </main>
    </React.Fragment>
  );
};

export default Home;
