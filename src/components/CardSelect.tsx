"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSelectFilter from "@/hooks/use-select-filter";
 
interface CardSelectProps {
  name: string;
  items: {
    value: string;
    label: string;
  }[];
}

export default function CardSelect({ name, items }: CardSelectProps) {
  const { handleSelect } = useSelectFilter({
    name,
  });

  return (
    <div>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="ml-auto w-[110px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent onChange={() => handleSelect}>
          {items.map((item, i) => (
            <SelectItem key={i} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
