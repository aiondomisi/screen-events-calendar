import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { capitalizeWords } from "../util/capitalizeWords";
import { useEffect, useState } from "react";

type RegionCardProps = {
  title: string;
};

const RegionCard = ({ title }: RegionCardProps) => {
  const webCalLink = `webcal://aiondomisi.github.io/screen-events-calendar/${title}.ics`;
  const link = `https://aiondomisi.github.io/screen-events-calendar/${title}.ics`;
  const renameTitle =
    title === "festivals" || title === "awards"
      ? `All ${capitalizeWords(title)}`
      : capitalizeWords(
          title.replace(/^(?:festival-|award)/i, "").replace(/-/g, " "),
        );

  const [copy, setCopy] = useState(false);

  useEffect(() => {
    if (!copy) return;

    const timer = setTimeout(() => {
      setCopy(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [copy]);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-semibold ">{renameTitle}</h3>
      <div className="flex bg-gray-100 p-3 rounded-lg justify-between items-center">
        <p>{link}</p>
        <Button
          variant={"outline"}
          className={"cursor-pointer"}
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopy(true);
          }}
        >
          <Copy />
          {copy ? "Copied" : "Copy"}
        </Button>
      </div>
      <a href={webCalLink} className="w-full">
        <Button className="w-full py-7 font-semibold text-[17px]">
          Subscribe to {renameTitle}
        </Button>
      </a>
    </div>
  );
};

export default RegionCard;
