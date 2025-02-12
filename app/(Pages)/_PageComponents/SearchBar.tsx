"use client";
import axios from "@/app/api/axios/axios";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

interface Suggestion {
  id: string;
  name: string;
  type: "store" | "category" | "event";
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query) return [];

    const [storesRes, categoriesRes, eventsRes] = await Promise.all([
      axios.get(`/getdisplaystores?like=${query}&page=1`),
      axios.get(`/getdisplaycategories?like=${query}&page=1`),
      axios.get(`/getdisplayevents`),
    ]);

    const storesData = storesRes?.data?.stores;
    const categoriesData = categoriesRes?.data?.categories;
    const eventsData = eventsRes?.data?.events;

    const storesSuggestions = storesData?.map((store: any) => ({
      id: store.storeId,
      name: store.name,
      type: "store" as const,
    }));

    const categoriesSuggestions = categoriesData?.map((category: any) => ({
      id: category.categoryId,
      name: category.name,
      type: "category" as const,
    }));

    const eventsSuggestions = eventsData?.map((event: any) => ({
      id: event.eventId,
      name: event.name,
      type: "event" as const,
    }));

    const allSuggestions = [
      ...storesSuggestions,
      ...categoriesSuggestions,
      ...eventsSuggestions,
    ].filter((suggestion) =>
      suggestion.name.toLowerCase().includes(query.toLowerCase()),
    );

    return allSuggestions;
  };

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["suggestions", query],
    queryFn: () => fetchSuggestions(query),
    enabled: query.length > 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const debouncedSetQuery = useCallback(
    debounce((value: string) => {
      setQuery(value);
      setLastQuery(value);
      setShowSuggestions(value.length > 1);
    }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleInputFocus = () => {
    if (lastQuery.length > 1) {
      setQuery(lastQuery);
      setShowSuggestions(true);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="font-semibold text-app-main">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const groupedSuggestions = suggestions.reduce(
    (acc: any, suggestion: any) => {
      if (!acc[suggestion.type]) {
        acc[suggestion.type] = [];
      }
      acc[suggestion.type].push(suggestion);
      return acc;
    },
    {} as Record<string, Suggestion[]>,
  );

  const getTypePlural = (type: string) => {
    if (type === "category") return "categories";
    return type + "s";
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="flex w-56 items-center justify-between rounded-full border-2 border-app-main p-1 sm:w-64 sm:px-3 sm:py-1">
        <input
          id="search"
          type="text"
          ref={inputRef}
          className="w-full border-none bg-transparent caret-rose-600 outline-none placeholder:text-xs md:placeholder:text-xs"
          placeholder="Search for brands, categories"
          onChange={(e) => debouncedSetQuery(e.target.value)}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        <label htmlFor="search">
          <Search className="ml-1 size-4 text-app-main" />
        </label>
      </div>
      {showSuggestions && (
        <div className="absolute z-10 mt-2 w-full rounded-md bg-popover shadow-lg">
          {isLoading ? (
            <div className="flex min-h-24 w-full items-center justify-center">
              <Spinner />
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1 text-base">
              {(
                Object.keys(groupedSuggestions) as Array<
                  keyof typeof groupedSuggestions
                >
              ).map((type) => (
                <li key={type as string}>
                  <h3 className="px-4 py-2 font-semibold uppercase">
                    {getTypePlural(type as string)}
                  </h3>
                  <Separator />
                  {groupedSuggestions[type].map((suggestion: any) => (
                    <Link
                      key={suggestion.id}
                      href={`/${getTypePlural(suggestion.type)}/${encodeURIComponent(
                        suggestion.name,
                      )}`}
                      className="block px-4 py-2 hover:bg-primary-foreground"
                    >
                      {highlightMatch(suggestion.name, query)}
                    </Link>
                  ))}
                  {type !== Object.keys(groupedSuggestions).pop() && (
                    <Separator />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
