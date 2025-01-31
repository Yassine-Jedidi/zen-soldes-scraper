import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { useEffect } from "react"; // Import useEffect to handle default sorting

interface SortProductsProps {
  onSortChange: (sortBy: string) => void;
  defaultSort?: string; // Add defaultSort prop
}

export const SortProducts = ({
  onSortChange,
  defaultSort,
}: SortProductsProps) => {
  useEffect(() => {
    if (defaultSort) {
      onSortChange(defaultSort);
    }
  }, [defaultSort, onSortChange]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowDownUp className="h-4 w-4" />
          Sort by
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onSortChange("")}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSortChange("priceAsc")}>
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSortChange("priceDesc")}>
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
