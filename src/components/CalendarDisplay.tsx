import FullCalendar from "@fullcalendar/react";
import themePlugin from "@fullcalendar/react/themes/monarch";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import listPlugin from "@fullcalendar/react/list";
import multiMonthPlugin from "@fullcalendar/react/multimonth";
import festivals from "../data/events.json";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SelectedEvent = {
  title: string;
  start: Date | null;
  end: Date | null;
  website?: string;
  category?: string;
};

export function CalendarDisplay() {
  const [selected, setSelected] = useState<SelectedEvent | null>(null);
  const data = festivals.events.filter(
    (item) => item.startDate && item.endDate,
  );

  return (
    <>
      <FullCalendar
        dayMaxEventRows={true}
        colorScheme="light"
        events={data.map((item) => ({
          title: item.name,
          start: item.startDate,
          end: item.endDate,
          color: item?.category == "festival" ? "#508295" : "#D05A16",
          extendedProps: {
            website: item.website,
            category: item.category,
          },
        }))}
        // events={[
        //   { title: "event 1", date: "2026-09-09", allDay: true },
        //   { title: "event 2", date: "2026-09-02" },
        // ]}
        // eventColor="#508295"
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

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.start?.toLocaleDateString()}
              {selected?.end && ` – ${selected.end.toLocaleDateString()}`}
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
    </>
  );
}
