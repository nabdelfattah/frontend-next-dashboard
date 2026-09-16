"use client";

import { useRef } from "react";
import { ImageGroup } from "./types";
import { Dropdown } from "../dropdown/dropdown";
import AvatarText from "../avatar/avatar-text";
import Avatar from "../avatar/avatar";
import useDropdownToggle from "../../hooks/use-dropdown-toggle";

const MAX_VISIBLE = 3;
const CLOSE_DELAY_MS = 150;

function GroupAvatar({
  member,
}: {
  member: ImageGroup;
}) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-muted"
      style={{ width: 32, height: 32 }}
    >
      {member.image ? (
        <Avatar src={member.image} alt={member.name} />
      ) : (
        <AvatarText name={member.name.charAt(0).toUpperCase()}/>
       
      )}
    </div>
  );
}

/**
 * Overlapping avatar stack for an `IMAGE_GROUP` column. Shows up to 3 members,
 * a "+N" badge for the rest, and a hover panel listing everyone.
 *
 * The panel renders through the shared `Dropdown` (a floating-ui portal) rather
 * than an absolutely-positioned child, so it isn't clipped by the table's
 * horizontal-scroll wrapper (which — per the CSS overflow-x/overflow-y coupling —
 * must keep vertical overflow hidden to avoid an incidental vertical scrollbar).
 */
export default function ImageGroupCell({ members }: { members: ImageGroup[] }) {
  const { isOpen, open, close } = useDropdownToggle();
  const anchorRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    open();
  };
  const closeSoon = () => {
    closeTimeout.current = setTimeout(close, CLOSE_DELAY_MS);
  };

  if (!members || members.length === 0) {
    return (
      <span className="text-muted-foreground text-theme-sm">—</span>
    );
  }

  const visible = members.slice(0, MAX_VISIBLE);
  const overflowCount = members.length - visible.length;

  return (
    <div
      ref={anchorRef}
      className="relative inline-block"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <div className="flex -space-x-2">
        {visible.map((member) => (
          <GroupAvatar key={member.id} member={member} />
        ))}
        {overflowCount > 0 && (
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-muted text-theme-xs font-medium text-muted-foreground">
            +{overflowCount}
          </div>
        )}
      </div>

      <Dropdown
        isOpen={isOpen}
        onClose={close}
        anchorRef={anchorRef}
        className="min-w-[180px] p-2"
      >
        <ul
          className="flex flex-col gap-1"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5"
            >
              <GroupAvatar member={member} />
              <span className="text-muted-foreground text-theme-sm">
                {member.name}
              </span>
            </li>
          ))}
        </ul>
      </Dropdown>
    </div>
  );
}
