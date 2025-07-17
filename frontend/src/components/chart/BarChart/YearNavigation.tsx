import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";


interface Props {
  currentYear: dayjs.Dayjs;
  onPrev: () => void;
  onNext: () => void;
  today: dayjs.Dayjs;
}
const YearNavigation = ({ currentYear, onPrev, onNext, today }:Props) => {
  return (
    <div className="flex gap-2 mt-2">
      <Button className="cursor-pointer" variant="outline" size="icon" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="inline-flex items-center justify-center text-sm font-medium h-8 min-w-[140px]">
        {currentYear.format("YYYY")}
      </span>
      <Button
        className="cursor-pointer"
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={currentYear.isSame(today, "year")}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default YearNavigation;
