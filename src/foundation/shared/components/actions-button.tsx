"use client";
import { useRef, useState } from "react";
import { ActionButtonItem } from "../types/props";
import { EllipsisVertical } from "@/assets/icons";
import { Dropdown } from "./dropdown/dropdown";
import { DropdownItem } from "./dropdown/dropdown-item";

/**
 * Page-level actions trigger: an ellipsis button that opens a dropdown menu of actions.
 *
 * Each action must be defined in a Client Component — its `action` callback is passed
 * directly to `ActionsButton`, which cannot cross a Server Component boundary.
 *
 * @param actions - Dropdown menu items: `label` (required), an optional `icon` rendered before the label, and either `path` (renders a link) or `action` (called on click) — exactly one of the two is required. When omitted or empty, a static, non-interactive ellipsis is rendered instead.
 *
 * @example
 * <ActionsButton
 *   actions={[
 *     { label: "Edit", icon: <PencilIcon />, path: "/users/1/edit" },
 *     { label: "Delete", icon: <TrashIcon />, action: handleDelete },
 *   ]}
 * />
 */
export default function ActionsButton({
  actions,
}: {
  actions?: ActionButtonItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  if (!actions || actions.length === 0) {
    return (
      <button className="flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:text-gray-400 lg:h-11 lg:w-11 hover:text-dark-900 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white">
        <EllipsisVertical className="h-5 w-5" />
      </button>
    );
  }

  const nonDangerActions = actions.filter((item) => item.variant !== "danger");
  const dangerActions = actions.filter((item) => item.variant === "danger");

  const renderAction = (item: ActionButtonItem, key: string) => (
    <DropdownItem
      key={key}
      tag={item.path ? "a" : "button"}
      href={item.path}
      onClick={item.action}
      onItemClick={() => setIsOpen(false)}
      className={`flex items-center gap-2 rounded-lg ${
        item.variant === "danger"
          ? "!text-error-500 hover:!bg-error-50 dark:hover:!bg-error-500/15"
          : ""
      }`}
    >
      {item.icon && <span className="flex items-center">{item.icon}</span>}
      {item.label}
    </DropdownItem>
  );

  return (
    <div className="relative">
      <button
        ref={anchorRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="dropdown-toggle flex items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg dark:text-gray-400 lg:h-11 lg:w-11 hover:text-dark-900 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        anchorRef={anchorRef}
        className="flex min-w-[160px] flex-col gap-1 p-2"
      >
        {nonDangerActions.map((item, index) =>
          renderAction(item, `${item.label}-${index}`)
        )}
        {nonDangerActions.length > 0 && dangerActions.length > 0 && (
          <div className="my-1 h-px bg-gray-200 dark:bg-white/10" />
        )}
        {dangerActions.map((item, index) =>
          renderAction(item, `${item.label}-danger-${index}`)
        )}
      </Dropdown>
    </div>
  );
}
