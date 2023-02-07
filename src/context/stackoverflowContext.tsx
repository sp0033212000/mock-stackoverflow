import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { NOOP } from "@/constant";

import useDebounceAsync from "@/hooks/useDebounceAsync";

import stackoverflow, { ITagEntity } from "@/libs/stackoverflow";

interface StackoverflowContextStore {
  keyword: string;
  tags: Array<ITagEntity>;
  selectedTags: Array<string>;
  onTagSelect: (tag: string) => void;
  onKeywordChange: React.ChangeEventHandler<HTMLInputElement>;
}

const stackoverflowContext = createContext<StackoverflowContextStore>({
  keyword: "",
  tags: [],
  selectedTags: [],
  onTagSelect: NOOP,
  onKeywordChange: NOOP,
});

export const useStackoverflowContext = () => useContext(stackoverflowContext);

export const StackoverflowContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [keyword, setKeyword] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);

  const { value: tagsData } = useDebounceAsync(
    async () =>
      await stackoverflow.tags.getMany({
        page: 1,
        pagesize: 10,
        order: "desc",
        inname: keyword,
      }),
    [keyword]
  );

  useEffect(() => {
    if (!tagsData) return;
    setSelectedTags([tagsData.items[0].name]);
  }, [tagsData]);

  const onTagSelect = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      let result: Array<string>;
      if (prev.includes(tag)) {
        result = prev.filter((_tag) => _tag !== tag);
      } else {
        result = prev.concat(tag);
      }

      if (result.length > 5) return prev;
      else return result;
    });
  }, []);

  const tags = useMemo(() => (tagsData ? tagsData.items : []), [tagsData]);

  const onKeywordChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((event) => {
    setKeyword(event.target.value);
  }, []);

  return (
    <stackoverflowContext.Provider
      value={{ keyword, selectedTags, tags, onTagSelect, onKeywordChange }}
    >
      {children}
    </stackoverflowContext.Provider>
  );
};
