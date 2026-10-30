import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import listPlugin from "@fullcalendar/react/list";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import themePlugin from "@fullcalendar/react/themes/monarch";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import festivals from "../data/events.json";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { eventToCalendarEvent } from "../util/eventToCalendarEvent";
import SearchBox from "./SearchBox";
import { CalendarSkeleton } from "./CalendarSkeleton";

type SelectedEvent = {
  title: string;
  start: Date | null;
  end: Date | null;
  website?: string;
  category?: string;
};

const data = festivals.events.filter((item) => item.startDate && item.endDate);
const INIT_EVENTS = eventToCalendarEvent(data);

export function CalendarDisplay() {
  const [selected, setSelected] = useState<SelectedEvent | null>(null);

  const [eventChoose, setEventChoose] = useState<any>(null);

  const eventDisplay = useMemo(
    () =>
      eventChoose
        ? eventToCalendarEvent(
            data.filter((item) => item.uid === eventChoose.id),
          )
        : INIT_EVENTS,
    [eventChoose],
  );

  const calendarRef = useRef<React.ComponentRef<typeof FullCalendar>>(null);

  useEffect(() => {
    if (eventChoose) {
      calendarRef.current?.getApi().gotoDate(eventChoose.startDate);
    }
  }, [eventChoose]);

  // const [ready, setReady] = useState(false);

  return (
    <div className="mt-6 flex flex-col gap-5 my-calendar">
      <SearchBox eventChoose={eventChoose} setEventChoose={setEventChoose} />
      {/* {!ready && <CalendarSkeleton />} */}
      <FullCalendar
        ref={calendarRef}
        // datesSet={() => setReady(true)}
        dayMaxEventRows={true}
        colorScheme="light"
        eventDidMount={(info) => {
          info.el.style.cursor = "pointer";
        }}
        events={eventDisplay}
        plugins={[
          themePlugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          multiMonthPlugin,
        ]}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          setSelected({
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            website: info.event.extendedProps.website,
            category: info.event.extendedProps.category,
          });
        }}
        titleFormat={{ year: "numeric", month: "short" }}
        headerToolbar={{
          start: "today prev,next title",
          end: "dayGridMonth,listWeek,multiMonthYear",
        }}
        initialView="dayGridMonth"
      />
      {/* </div> */}

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.start && dayjs(selected.start).format("DD MMM YYYY")}
              {selected?.end &&
                ` – ${dayjs(selected.end).format("DD MMM YYYY")}`}
            </DialogDescription>
          </DialogHeader>
          {selected?.website && (
            <Button variant={"ghost"}>
              <a href={selected.website} target="_blank" rel="noreferrer">
                Visit website
              </a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
