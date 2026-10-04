import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { search } from "../util/eventIndexing";
import type { SearchResult } from "minisearch";

type SearchBoxProps = {
  setEventChoose: Dispatch<SetStateAction<any>>;
  eventChoose: any;
};

type EventItem = { id: string; name: string; startDate: string };

const SearchBox = ({ eventChoose, setEventChoose }: SearchBoxProps) => {
  const [items, setItems] = useState<EventItem[]>();
  const [searchVal, setSearchVal] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setItems(
        searchVal ? (search.search(searchVal) as unknown as EventItem[]) : [],
      );
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchVal]);

  return (
    <Combobox
      items={items}
      value={eventChoose}
      onValueChange={setEventChoose}
      itemToStringLabel={(item: EventItem) => item.name}
      isItemEqualToValue={(a: EventItem, b: EventItem) => a.id === b.id}
      filter={null}
    >
      <ComboboxInput
        className="h-10 text-2xl"
        placeholder="Search festival / award name"
        onChange={(e) => setSearchVal(e.target.value)}
        showClear
      />
      <ComboboxContent>
        {searchVal && <ComboboxEmpty>No items found.</ComboboxEmpty>}

        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.id} value={item}>
              {item.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default SearchBox;
