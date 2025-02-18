import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@prisma/client";
import React from "react";
import SearchBar from "./upper-info-bar";
import ThemeSwitcher from "../mode-toggle";

type Props = {
  user: User;
  children: React.ReactNode;
};
const UpperInfoBar = ({ user }: Props) => {
  return (
    <header className="sticky top-0 z-[10] flex shrink-0 flex-wrap items-center gap-2 border-b bg-background p-4 justify-between">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-2 h-4" orientation="vertical" />
      <div className="w-full max-w-[95%] flex items-center justify-between gap-4 flex-wrap">
        <SearchBar />
      </div>
      <ThemeSwitcher />
    </header>
  );
};

export default UpperInfoBar;
