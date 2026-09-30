import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CardDisplayProps = {
  cardTitle: string;
  cardDescription: string;
  category: "festivals" | "awards";
};

export const CardDisplay = ({
  cardTitle,
  cardDescription,
  category,
}: CardDisplayProps) => {
  return (
    <a href={`/${category}`}>
      <Card className="group w-full hover:bg-primary hover:text-white cursor-pointer">
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription className="group-hover:text-white">
            {cardDescription}
          </CardDescription>
        </CardHeader>
      </Card>
    </a>
  );
};
