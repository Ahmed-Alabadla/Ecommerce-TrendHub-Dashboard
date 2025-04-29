import React from "react";
import { ModeToggle } from "../ModeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
