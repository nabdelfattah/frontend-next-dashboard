"use client";
import { ThemeToggleButton } from "@/components/common/theme-toggle-button";
import { DropdownGroupProvider } from "@layout/header/dropdown-group-context";
import LanguageSwitcher from "@layout/header/language-switcher";
import NotificationDropdown from "@layout/header/notification-dropdown";
import ThemeConfigurator from "@layout/header/theme-configurator";
import UserDropdown from "@layout/header/user-dropdown";
import { useSidebar } from "@core/context/sidebar-context";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { X, Menu, Ellipsis } from "@/assets/icons";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const t = useTranslations("common");

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-99999 dark:border-gray-800 lg:flex dark:text-gray-400 lg:h-11 lg:w-11 lg:border transition hover:text-dark-900 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
            onClick={handleToggle}
            aria-label={t("sidebar.toggleSidebar")}
          >
            {isMobileOpen ? (
              <X  />
            ) : (
              <Menu  />
            )}
            {/* Cross Icon */}
          </button>

          <Link href="/" className="lg:hidden">
            <Image
              width={154}
              height={32}
              className="dark:hidden"
              src="/images/logo/logo.svg"
              alt="Logo"
            />
            <Image
              width={154}
              height={32}
              className="hidden dark:block"
              src="/images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link>

          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-99999 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <Ellipsis />
          </button>

          
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
          <DropdownGroupProvider>
            <div className="flex items-center gap-2 2xsm:gap-3">
              {/* <!-- Dark Mode Toggler --> */}
              <ThemeToggleButton />

              {/* <!-- Theme Configurator --> */}
              <ThemeConfigurator />

              {/* <!-- Language Switcher --> */}
              <LanguageSwitcher />

              <NotificationDropdown />
              {/* <!-- Notification Menu Area --> */}
            </div>
            {/* <!-- User Area --> */}
            <UserDropdown />
          </DropdownGroupProvider>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
