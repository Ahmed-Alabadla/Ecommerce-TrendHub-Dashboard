"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AtSign, UserRound, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function UsersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use state to manage input values for better responsiveness
  const [nameValue, setNameValue] = useState(searchParams.get("name") || "");
  const [emailValue, setEmailValue] = useState(searchParams.get("email") || "");

  useEffect(() => {
    setNameValue(searchParams.get("name") || "");
    setEmailValue(searchParams.get("email") || "");
  }, [searchParams]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    params.set("page", "1");
    return params.toString();
  };

  const handleSearchName = useDebouncedCallback((term: string) => {
    setNameValue(term);
    router.push(`${pathname}?${createQueryString("name", term)}`, {
      scroll: false,
    });
  }, 300);
  const handleSearchEmail = useDebouncedCallback((term: string) => {
    setEmailValue(term);
    router.push(`${pathname}?${createQueryString("email", term)}`, {
      scroll: false,
    });
  }, 300);

  const clearFilters = () => {
    router.push(`${pathname}?page=1`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center gap-1.5 flex-col sm:flex-row">
        <div className="relative max-w-40 ">
          <AtSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search email..."
            className="pl-8"
            defaultValue={emailValue}
            onChange={(e) => handleSearchEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchEmail.flush()}
          />
          {emailValue && (
            <X
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => handleSearchEmail("")}
            />
          )}
        </div>
        <div className="relative max-w-40 ">
          <UserRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            className="pl-8"
            defaultValue={nameValue}
            onChange={(e) => handleSearchName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchName.flush()}
          />
          {nameValue && (
            <X
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
              onClick={() => handleSearchName("")}
            />
          )}
        </div>
      </div>

      {(nameValue || emailValue) && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          Clear filters
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
