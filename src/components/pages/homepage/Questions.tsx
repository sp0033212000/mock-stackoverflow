import React, { useCallback, useRef } from "react";
import { useAsyncFn, useUpdateEffect } from "react-use";

import clsx from "clsx";

import {
  Heading,
  HStack,
  Image,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import useOnEndReached from "@/hooks/useOnEndReached";

import { useStackoverflowContext } from "@/context/stackoverflowContext";

import stackoverflow, { IQuestionEntity } from "@/libs/stackoverflow";

import Flexbox from "@/components/layout/Flexbox";

const Questions: React.FC = () => {
  // const [page, setPage] = useState<number>(1);

  const { selectedTags } = useStackoverflowContext();

  const fromDateCache = useRef<number>(new Date().getTime());
  const page = useRef<number>(1);

  const [{ value, loading }, fetch] = useAsyncFn(
    async (defaultItems: Array<IQuestionEntity> = []) => {
      if (page.current === 1) fromDateCache.current = new Date().getTime();

      const data = await stackoverflow.questions.getMany(
        {
          page: page.current,
          pagesize: 20,
          tagged: selectedTags.join(";"),
          order: "desc",
          todate: parseInt(`${fromDateCache.current / 1000}`, 10),
        },
        { disableLoader: page.current > 1 }
      );

      return {
        ...data,
        items: defaultItems.concat(data.items),
      };
    },
    [selectedTags]
  );

  useUpdateEffect(() => {
    page.current = 1;
    fetch();
  }, [fetch]);

  const turnPage = useCallback(async () => {
    if (!value) return;
    if (loading) return;
    if (!value.has_more) return;
    page.current++;
    await fetch(value.items);
  }, [value, loading]);

  useOnEndReached({
    onEndReached: turnPage,
    wait: 1500,
    disabled: loading || !value?.has_more,
  });

  return (
    <section className={"pb-6"}>
      <Heading as={"h2"} className={"mb-4"}>
        Questions
      </Heading>
      <div className={"divide-y divide-gray-400"}>
        {value?.items.map((question) => {
          const highlightScore = question.score < 0;
          const noAnswer = question.answer_count <= 0;

          return (
            <Flexbox
              as={"a"}
              rel={"noreferrer noopener"}
              href={question.link}
              target={"_blank"}
              key={question.question_id}
              direction={"column"}
              className={clsx("sm:flex-row", "py-4", "sm:hover:cursor-pointer")}
            >
              <Stack>
                <HStack>
                  {/*Score*/}
                  <div
                    className={clsx(
                      "border",
                      {
                        "border-green-500": !highlightScore,
                        "border-red-500": highlightScore,
                      },
                      "rounded-md",
                      "overflow-hidden"
                    )}
                  >
                    <Text
                      className={clsx(
                        "px-2",
                        "text-white font-bold",
                        "border-b",
                        {
                          "border-green-500 bg-green-500": !highlightScore,
                          "border-red-500 bg-red-500": highlightScore,
                        }
                      )}
                    >
                      Score
                    </Text>
                    <Text
                      className={clsx("px-2 text-center", {
                        "font-bold": highlightScore,
                      })}
                    >
                      {question.score}
                    </Text>
                  </div>
                  {/*Answers*/}
                  <div
                    className={clsx(
                      "border",
                      {
                        "border-green-500": !question.is_answered || !noAnswer,
                        "border-red-500": noAnswer,
                      },
                      "rounded-md",
                      "overflow-hidden"
                    )}
                  >
                    <Text
                      className={clsx("px-2", "font-bold", "border-b", {
                        "text-white": question.is_answered || noAnswer,
                        "border-green-500 text-green-500":
                          !question.is_answered && !noAnswer,
                        "bg-green-500": question.is_answered,
                        "border-red-500 bg-red-500": noAnswer,
                      })}
                    >
                      Answers
                    </Text>
                    <Text className={clsx("px-2 text-center")}>
                      {question.answer_count}
                    </Text>
                  </div>
                  {/*Viewed*/}
                  <div
                    className={clsx(
                      "border border-green-500",
                      "rounded-md",
                      "overflow-hidden"
                    )}
                  >
                    <Text
                      className={clsx(
                        "px-2",
                        "font-bold text-white",
                        "border-b border-green-500",
                        "bg-green-500"
                      )}
                    >
                      Viewed
                    </Text>
                    <Text className={clsx("px-2 text-center")}>
                      {question.view_count}
                    </Text>
                  </div>
                </HStack>
                <div className={"py-4 sm:pb-0"}>
                  <Heading size="md">{question.title}</Heading>
                </div>
              </Stack>
              <Flexbox
                direction={"row"}
                align={"center"}
                className={
                  "sm:flex-col-reverse sm:ml-auto self-end sm:select-none shrink-0"
                }
              >
                <Text
                  className={"mr-2 sm:mr-0 text-xs sm:text-lg font-semibold"}
                >
                  {question.owner.display_name}
                </Text>
                <Image
                  objectFit="cover"
                  src={question.owner.profile_image}
                  alt={question.owner.display_name}
                  className={"w-10 h-10 sm:w-20 sm:h-20 rounded-extreme"}
                />
              </Flexbox>
            </Flexbox>
          );
        })}
      </div>
      <Stack
        hidden={!(loading && page.current > 1)}
        className={"pt-5 border-t border-gray-500"}
      >
        <Skeleton height={"20px"} />
        <Skeleton height={"20px"} />
        <Skeleton height={"20px"} />
      </Stack>
    </section>
  );
};
3;
export default Questions;
