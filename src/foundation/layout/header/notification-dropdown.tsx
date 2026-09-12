"use client";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Dropdown } from "@shared/components/dropdown/dropdown";
import { DropdownItem } from "@shared/components/dropdown/dropdown-item";
import { useDropdownGroup } from "@layout/header/dropdown-group-context";
import { Bell, UserRound } from "@/assets/icons";

export default function NotificationDropdown() {
  const { isOpen, toggle, close } = useDropdownGroup("notifications");
  const [notifying, setNotifying] = useState(true);
  const t = useTranslations("common.notifications");
  const anchorRef = useRef<HTMLButtonElement>(null);

  // TODO: replace with real notifications data
  const notifications = [
    { name: "Terry Franci", avatar: null as string | null, status: "success" as const, time: t("minutesAgo", { count: 5 }) },
    { name: "Alena Franci", avatar: null as string | null, status: "success" as const, time: t("minutesAgo", { count: 8 }) },
    { name: "Jocelyn Kenter", avatar: null as string | null, status: "success" as const, time: t("minutesAgo", { count: 15 }) },
    { name: "Brandon Philips", avatar: null as string | null, status: "error" as const, time: t("hourAgo", { count: 1 }) },
    { name: "Terry Franci", avatar: null as string | null, status: "success" as const, time: t("minutesAgo", { count: 5 }) },
    { name: "Alena Franci", avatar: null as string | null, status: "success" as const, time: t("minutesAgo", { count: 8 }) },
    { name: "Jocelyn Kenter", avatar: null as string | null, status: "success" as const, time: t("minutesAgo", { count: 15 }) },
    { name: "Brandon Philips", avatar: null as string | null, status: "error" as const, time: t("hourAgo", { count: 1 }) },
  ];

  function toggleDropdown() {
    toggle();
  }

  function closeDropdown() {
    close();
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };
  return (
    <div className="relative">
      <button
        ref={anchorRef}
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleClick}
      >
        <span
          className={`absolute end-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${
            !notifying ? "hidden" : "flex"
          }`}
        >
          <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
        </span>
        <Bell />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        anchorRef={anchorRef}
        className="flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-[361px]"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("title")}
          </h5>
          <button
            onClick={toggleDropdown}
            className="text-gray-500 transition dropdown-toggle dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {notifications.map((notification, index) => (
            <li key={index}>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
              >
                <span className="relative block w-full h-10 max-w-10 rounded-full z-1">
                  <span
                    className={`flex items-center justify-center w-full h-full overflow-hidden rounded-full bg-gray-50 dark:bg-gray-800 ${
                      notification.avatar ? "" : "border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {notification.avatar ? (
                      <Image
                        width={40}
                        height={40}
                        src={notification.avatar}
                        alt={notification.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserRound className="text-gray-500 dark:text-gray-400" />
                    )}
                  </span>
                  <span
                    className={`absolute bottom-0 end-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
                      notification.status === "error" ? "bg-error-500" : "bg-success-500"
                    }`}
                  ></span>
                </span>

                <span className="block">
                  <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {notification.name}
                    </span>
                    <span>{t("requestsPermission")}</span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      Project - Nganter App
                    </span>
                  </span>

                  <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                    <span>{t("project")}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>{notification.time}</span>
                  </span>
                </span>
              </DropdownItem>
            </li>
          ))}
          {/* Add more items as needed */}
        </ul>
        <Link
          href="/"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {t("viewAll")}
        </Link>
      </Dropdown>
    </div>
  );
}
