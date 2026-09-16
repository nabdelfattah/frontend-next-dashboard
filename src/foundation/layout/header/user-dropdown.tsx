"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { Dropdown } from "@shared/components/dropdown/dropdown";
import { DropdownItem } from "@shared/components/dropdown/dropdown-item";
import useDropdownToggle from "@shared/hooks/use-dropdown-toggle";
import { ChevronDown,  CircleUserRound, Settings, Info,LogOut, UserRound   } from "@/assets/icons";

export default function UserDropdown() {
  const { isOpen, toggle, close } = useDropdownToggle();
  const t = useTranslations("common.userMenu");
  const anchorRef = useRef<HTMLButtonElement>(null);

  // TODO: replace with real auth/user state management
  const user = {
    name: "Musharof",
    fullName: "Musharof Chowdhury",
    email: "randomuser@pimjo.com",
    image: null as string | null,
  };

function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  e.stopPropagation();
  toggle();
}

  function closeDropdown() {
    close();
  }
  return (
    <div className="relative">
      <button
        ref={anchorRef}
        onClick={toggleDropdown}
        className="flex items-center text-muted-foreground dropdown-toggle"
      >
        <span className="flex items-center justify-center me-2 text-muted-foreground transition-colors bg-surface border border-border rounded-full hover:text-dark-900 h-11 w-11 hover:bg-muted hover:text-foreground">
          {user.image ? (
            <Image
              width={44}
              height={44}
              src={user.image}
              alt="User"
            />
          ) : (
            <UserRound />
          )}
        </span>

        <span className="hidden me-1 font-medium text-theme-sm lg:block">{user.name}</span>

        <ChevronDown className={`stroke-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}/>
        
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        anchorRef={anchorRef}
        className="flex w-[260px] flex-col rounded-2xl border border-border bg-popover p-3 shadow-theme-lg"
      >
        <div>
          <span className="block font-medium text-muted-foreground text-theme-sm">
            {user.fullName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-muted-foreground">
            {user.email}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-border">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-muted-foreground rounded-lg group text-theme-sm hover:bg-muted hover:text-foreground"
            >
              <CircleUserRound />
              {t("editProfile")}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-muted-foreground rounded-lg group text-theme-sm hover:bg-muted hover:text-foreground"
            >
              <Settings  />
              {t("accountSettings")}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-muted-foreground rounded-lg group text-theme-sm hover:bg-muted hover:text-foreground"
            >
              <Info />
              {t("support")}
            </DropdownItem>
          </li>
        </ul>
        <Link
          href="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-muted-foreground rounded-lg group text-theme-sm hover:bg-muted hover:text-foreground"
        >
          <LogOut />
          {t("signOut")}
        </Link>
      </Dropdown>
    </div>
  );
}
