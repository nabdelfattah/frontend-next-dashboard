"use client";
import { useRef } from "react";
import { ActionButtonItem } from "../types/props";
import { EllipsisVertical } from "@/assets/icons";
import { Dropdown } from "./dropdown/dropdown";
import { DropdownItem } from "./dropdown/dropdown-item";
import useDropdownToggle from "../hooks/use-dropdown-toggle";

/**
 * Page-level actions trigger: an ellipsis button that opens a dropdown menu of actions.
 *
 * Each action must be defined in a Client Component — its `action` callback is passed
 * directly to `ActionsButton`, which cannot cross a Server Component boundary.
 *
 * @param actions - Dropdown menu items. Required — pass at least one. Each item needs a `label` (required), an optional `icon` rendered before the label, and either `path` (renders a link) or `action` (called on click) — exactly one of the two is required.
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
  actions: ActionButtonItem[];
}) {
  const { isOpen, toggle, close } = useDropdownToggle();
  const anchorRef = useRef<HTMLButtonElement>(null);

  const nonDangerActions = actions.filter((item) => item.variant !== "danger");
  const dangerActions = actions.filter((item) => item.variant === "danger");

  const renderAction = (item: ActionButtonItem, key: string) => (
    <DropdownItem
      key={key}
      tag={item.path ? "a" : "button"}
      href={item.path}
      onClick={item.action}
      onItemClick={close}
      className={`flex items-center gap-2 rounded-lg ${
        item.variant === "danger"
          ? "!text-error-500 hover:!bg-error-soft"
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
        onClick={toggle}
        className="dropdown-toggle flex items-center justify-center w-10 h-10 text-muted-foreground border-gray-200 rounded-lg lg:h-11 lg:w-11 transition duration-300 hover:text-dark-900 hover:bg-muted hover:text-foreground"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={close}
        anchorRef={anchorRef}
        className="flex min-w-[160px] flex-col gap-1 p-2"
      >
        {nonDangerActions.map((item, index) =>
          renderAction(item, `${item.label}-${index}`)
        )}
        {nonDangerActions.length > 0 && dangerActions.length > 0 && (
          <div className="my-1 h-px bg-border" />
        )}
        {dangerActions.map((item, index) =>
          renderAction(item, `${item.label}-danger-${index}`)
        )}
      </Dropdown>
    </div>
  );
}
