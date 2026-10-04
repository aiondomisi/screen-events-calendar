import event from "../data/events.json";
import MiniSearch from "minisearch";

export const search = new MiniSearch({
  fields: ["name"],
  storeFields: ["name", "startDate"],
  searchOptions: { fuzzy: 0.2, prefix: true },
  idField: "uid",
});

const eventFiltered = event.events.filter((item) => !!item.uid);

search.addAll(eventFiltered);
