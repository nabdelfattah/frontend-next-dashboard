"use client";
import { ThemeToggleButton } from "@shared/components/common/theme-toggle-button";
import LanguageSwitcher from "@layout/header/language-switcher";
import NotificationDropdown from "@layout/header/notification-dropdown";
import ThemeConfigurator from "@layout/header/theme-configurator";
import UserDropdown from "@layout/header/user-dropdown";
import { useSidebar } from "@core/providers/sidebar-provider";
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
    <header className="sticky top-0 flex w-full bg-surface border-border z-99999 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-border sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-muted-foreground border-border rounded-lg z-99999 lg:flex lg:h-11 lg:w-11 lg:border transition hover:text-dark-900 hover:bg-muted hover:text-foreground"
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
            className="flex items-center justify-center w-10 h-10 text-muted-foreground rounded-lg z-99999 hover:bg-muted lg:hidden"
          >
            <Ellipsis />
          </button>

          
        </div>
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
        >
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
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
