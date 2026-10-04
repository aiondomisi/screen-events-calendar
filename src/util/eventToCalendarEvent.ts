import festivals from "../data/events.json";

export const eventToCalendarEvent = (data: (typeof festivals)["events"]) => {
  return data.map((item) => ({
    title: item.name,
    start: item.startDate,
    end: item.endDate,
    color: item?.category == "festival" ? "#508295" : "#D05A16",
    extendedProps: {
      website: item.website,
      category: item.category,
    },
  }));
};
