"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check } from "lucide-react";
import React, {
  KeyboardEvent,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from "react";

type MultiSelectorProps = {
  values: string[];
  onValuesChange: (value: string[]) => void;
  options: { id: string; label: string }[];
  loop?: boolean;
  hidePlaceholderWhenSelected?: boolean;
  emptyIndicator?: string;
} & React.ComponentPropsWithoutRef<typeof CommandPrimitive>;

interface MultiSelectContextProps {
  value: string[];
  onValueChange: (value: any) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
  inputValue: string;
  emptyIndicator?: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  hidePlaceholderWhenSelected?: boolean;
  options: { id: string; label: string }[];
}

const MultiSelectContext = createContext<MultiSelectContextProps | null>(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector = ({
  values: value,
  onValuesChange: onValueChange,
  options,
  loop = false,
  hidePlaceholderWhenSelected = false,
  className,
  children,
  dir,
  emptyIndicator = "No Result Found",
  ...props
}: MultiSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const onValueChangeHandler = useCallback(
    (id: string) => {
      if (value.includes(id)) {
        onValueChange(value.filter((item) => item !== id));
      } else {
        onValueChange([...value, id]);
      }
    },
    [value, onValueChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(
          nextIndex > value.length - 1 ? (loop ? 0 : -1) : nextIndex,
        );
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? value.length - 1 : prevIndex);
      };

      if ((e.key === "Backspace" || e.key === "Delete") && value.length > 0) {
        if (inputValue.length === 0) {
          if (activeIndex !== -1 && activeIndex < value.length) {
            onValueChange(value.filter((item) => item !== value[activeIndex]));
            const newIndex = activeIndex - 1 < 0 ? 0 : activeIndex - 1;
            setActiveIndex(newIndex);
          } else {
            onValueChange(
              value.filter((item) => item !== value[value.length - 1]),
            );
          }
        }
      } else if (e.key === "Enter") {
        setOpen(true);
      } else if (e.key === "Escape") {
        if (activeIndex !== -1) {
          setActiveIndex(-1);
        } else {
          setOpen(false);
        }
      } else if (dir === "rtl") {
        if (e.key === "ArrowRight") {
          movePrev();
        } else if (e.key === "ArrowLeft" && (activeIndex !== -1 || loop)) {
          moveNext();
        }
      } else {
        if (e.key === "ArrowLeft") {
          movePrev();
        } else if (e.key === "ArrowRight" && (activeIndex !== -1 || loop)) {
          moveNext();
        }
      }
    },
    [value, inputValue, activeIndex, loop, onValueChange, dir],
  );

  return (
    <MultiSelectContext.Provider
      value={{
        value,
        onValueChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        hidePlaceholderWhenSelected,
        options,
        emptyIndicator,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn(
          "flex flex-col space-y-2 overflow-visible bg-transparent",
          className,
        )}
        dir={dir}
        {...props}
        filter={(value, search) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
        }}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange, activeIndex, options } = useMultiSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const getLabelById = (id: string) => {
    const option = options.find((opt) => opt.id === id);
    return option ? option.label : id;
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap gap-1 rounded-lg border border-muted bg-background p-1 py-2",
        className,
      )}
      {...props}
    >
      {value.map((id, index) => (
        <Badge
          key={id}
          className={cn(
            "flex items-center gap-1 rounded-xl px-1",
            activeIndex === index && "ring-2 ring-muted-foreground ",
          )}
          variant={"secondary"}
        >
          <span className="text-xs">{getLabelById(id)}</span>
          <button
            aria-label={`Remove ${getLabelById(id)} option`}
            aria-roledescription="button to remove option"
            type="button"
            onMouseDown={mousePreventDefault}
            onClick={() => onValueChange(id)}
          >
            <span className="sr-only">Remove {getLabelById(id)} option</span>
            <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
          </button>
        </Badge>
      ))}
      {children}
    </div>
  );
});

MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorInput = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    activeIndex,
    setActiveIndex,
    hidePlaceholderWhenSelected,
    value,
  } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      ref={ref}
      value={inputValue}
      onValueChange={activeIndex === -1 ? setInputValue : undefined}
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        "ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
        className,
        activeIndex !== -1 && "caret-transparent",
        hidePlaceholderWhenSelected && value.length > 0 && "placeholder:hidden",
      )}
    />
  );
});

MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children }, ref) => {
  const { open } = useMultiSelect();
  return (
    <div ref={ref} className="relative">
      {open && children}
    </div>
  );
});

MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children }, ref) => {
  const { emptyIndicator } = useMultiSelect();
  return (
    <CommandList
      ref={ref}
      className={cn(
        "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground dark:scrollbar-thumb-muted scrollbar-thumb-rounded-lg absolute top-0 z-10 flex w-full flex-col gap-2 rounded-md border border-muted bg-background p-2 shadow-md transition-colors",
        className,
      )}
    >
      {children}
      <CommandEmpty>
        <span className="text-muted-foreground">{emptyIndicator}</span>
      </CommandEmpty>
    </CommandList>
  );
});

MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  { id: string; label: string } & React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Item
  >
>(({ className, id, label, children, ...props }, ref) => {
  const { value: Options, onValueChange, setInputValue } = useMultiSelect();

  const mousePreventDefault = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isIncluded = Options.includes(id);
  return (
    <CommandItem
      ref={ref}
      {...props}
      onSelect={() => {
        onValueChange(id);
        setInputValue("");
      }}
      value={label}
      className={cn(
        "flex cursor-pointer justify-between rounded-md px-2 py-1 transition-colors ",
        className,
        isIncluded && "cursor-default opacity-50",
        props.disabled && "cursor-not-allowed opacity-50",
      )}
      onMouseDown={mousePreventDefault}
    >
      {children || label}
      {isIncluded && <Check className="h-4 w-4" />}
    </CommandItem>
  );
});

MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
