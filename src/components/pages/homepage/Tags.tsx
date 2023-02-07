import React from "react";

import { Heading, Tag } from "@chakra-ui/react";

import { useStackoverflowContext } from "@/context/stackoverflowContext";

import Flexbox from "@/components/layout/Flexbox";

const Tags: React.FC = () => {
  const { tags, selectedTags, onTagSelect } = useStackoverflowContext();

  return (
    <section className={"mb-4"}>
      <Heading as={"h2"} className={"mb-4"}>
        Trending
      </Heading>
      <Flexbox className={"max-w-full overflow-scroll"} align={"center"}>
        {tags.map(({ name }) => {
          const isSelected = selectedTags.includes(name);
          return (
            <Tag
              as={"button"}
              key={name}
              className={"mr-4 last:mr-0 shrink-0"}
              variant={isSelected ? "solid" : "outline"}
              onClick={() => onTagSelect(name)}
            >
              {name}
            </Tag>
          );
        })}
      </Flexbox>
    </section>
  );
};

export default Tags;
