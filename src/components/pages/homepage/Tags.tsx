import React from "react";

import { Heading, Tag, Text } from "@chakra-ui/react";

import { isEmptyArray, isNotEmptyArray, isNotEmptyString } from "@/utils";

import { useStackoverflowContext } from "@/context/stackoverflowContext";

import Flexbox from "@/components/layout/Flexbox";

const Tags: React.FC = () => {
  const { tags, selectedTags, onTagSelect, keyword } =
    useStackoverflowContext();

  return (
    <section className={"mb-4"}>
      <Heading as={"h2"} className={"mb-4"}>
        Trending
      </Heading>
      <Flexbox
        conditional={isNotEmptyArray(tags)}
        className={"max-w-full overflow-scroll"}
        align={"center"}
      >
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
      {isEmptyArray(tags) && isNotEmptyString(keyword) && (
        <Text color={"red.500"}>
          Could not found tags by keyword: {keyword}
        </Text>
      )}
    </section>
  );
};

export default Tags;
