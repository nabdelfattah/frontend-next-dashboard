"use client";

import { useRef, useState } from "react";
import {
  H1,
  H2,
  Text,
  Breadcrumb,
  PageHeading,
  ActionsButton,
  Button,
  Dropdown,
  DropdownItem,
  Badge,
  Alert,
  ConfirmDialog,
  Modal,
  SelectionBar,
  Avatar,
  AvatarText,
  ComponentCard,
} from "@shared/components";
import useDropdownToggle from "@shared/hooks/use-dropdown-toggle";
import { useModal } from "@shared/hooks/use-modal";
import { Star, Bell, Settings, LogOut, X } from "@/assets/icons";
import { Link } from "@/i18n/navigation";

/**
 * Component gallery / style guide for the team.
 *
 * Every ready-to-use component that lives in `src/foundation/shared/components`
 * is demoed here with its main variants, so you can see what's available and
 * how to use it before building something new from scratch. `Table` and
 * `SearchToolbar` are documented separately (they're data-driven, not a fit
 * for a static gallery like this one).
 *
 * Import everything shown here from the shared barrel:
 * `import { Button, Badge, ... } from "@shared/components";`
 */
export default function ComponentsPage() {
  return (
    <div className="space-y-6">
      {/* This header is itself a live example of PageHeading, which composes
          H1 + Breadcrumb + ActionsButton — see the dedicated sections below
          for each of those on their own. */}
      <PageHeading
        breadCrumbItems={[{ label: "Home", path: "/" }, { label: "Components" }]}
        actions={[
          { label: "Docs", icon: <Settings className="size-4" />, path: "#" },
          { label: "Refresh", icon: <Bell className="size-4" />, action: () => {} },
        ]}
      >
        Components
      </PageHeading>

      <Text>
        Live examples of every ready-to-use component in{" "}
        <code>src/foundation/shared/components</code>, excluding{" "}
        <code>Table</code> and <code>SearchToolbar</code>. Form components
        (Input, Select, Checkbox, and the rest) have their own gallery on the{" "}
        <Link href="/form" className="underline">
          Form
        </Link>{" "}
        page.
      </Text>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TypographyDemo />
        <ButtonDemo />
        <BadgeDemo />
        <AlertDemo />
        <AvatarDemo />
        <BreadcrumbDemo />
        <ActionsButtonDemo />
        <DropdownDemo />
        <ModalDemo />
        <ConfirmDialogDemo />
        <ComponentCardDemo />
      </div>

      <SelectionBarDemo />
    </div>
  );
}

function TypographyDemo() {
  return (
    <ComponentCard
      title="Typography — H1, H2, Text"
      desc="Page/section headings and supporting body text. Colors already adapt to dark mode."
    >
      <H1>H1 — page title</H1>
      <H2>H2 — section title</H2>
      <Text>Text — secondary/body copy, used for descriptions and hints.</Text>
    </ComponentCard>
  );
}

function ButtonDemo() {
  return (
    <ComponentCard
      title="Button"
      desc="variant: primary | outline | ghost — size: sm | md — plus loading and disabled states."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button startIcon={<Star className="size-4" />}>Start icon</Button>
        <Button endIcon={<LogOut className="size-4" />}>End icon</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
    </ComponentCard>
  );
}

function BadgeDemo() {
  return (
    <ComponentCard
      title="Badge"
      desc="color: primary | success | error | warning | info | light | dark. Size isn't configurable."
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge color="primary">Primary</Badge>
        <Badge color="success">Success</Badge>
        <Badge color="error">Error</Badge>
        <Badge color="warning">Warning</Badge>
        <Badge color="info">Info</Badge>
        <Badge color="light">Light</Badge>
        <Badge color="dark">Dark</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge color="success" startIcon={<Star className="size-3" />}>
          With start icon
        </Badge>
      </div>
    </ComponentCard>
  );
}

function AlertDemo() {
  return (
    <ComponentCard
      title="Alert"
      desc="variant: success | error | warning | info — an optional showLink adds a text link."
    >
      <Alert variant="success" title="Success" message="Your changes have been saved." />
      <Alert variant="error" title="Error" message="Something went wrong. Please try again." />
      <Alert
        variant="warning"
        title="Warning"
        message="This action can't be undone."
      />
      <Alert
        variant="info"
        title="Info"
        message="A new version is available."
        showLink
        linkHref="#"
        linkText="Learn more"
      />
    </ComponentCard>
  );
}

function AvatarDemo() {
  // task.jpg stands in for a real profile photo — the demo images that used
  // to ship under /images/user were removed; swap for a real src in actual use.
  const placeholder = "/images/task/task.jpg";
  return (
    <ComponentCard
      title="Avatar & AvatarText"
      desc="Avatar: size xsmall→xxlarge, optional status dot. AvatarText: initials fallback, colored deterministically from the name."
    >
      <div className="flex flex-wrap items-end gap-4">
        <Avatar src={placeholder} size="xsmall" />
        <Avatar src={placeholder} size="small" />
        <Avatar src={placeholder} size="medium" />
        <Avatar src={placeholder} size="large" />
        <Avatar src={placeholder} size="xlarge" />
        <Avatar src={placeholder} size="xxlarge" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar src={placeholder} status="online" />
        <Avatar src={placeholder} status="busy" />
        <Avatar src={placeholder} status="offline" />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <AvatarText name="Musharof Chowdhury" />
        <AvatarText name="Nada Abdelfattah" />
        <AvatarText name="John Doe" />
      </div>
    </ComponentCard>
  );
}

function BreadcrumbDemo() {
  const short = [{ label: "Home", path: "/" }, { label: "Components" }];
  const long = [
    { label: "Home", path: "/" },
    { label: "Users", path: "/users" },
    { label: "Teams", path: "/users/teams" },
    { label: "Members", path: "/users/teams/members" },
    { label: "Edit member" },
  ];

  return (
    <ComponentCard
      title="Breadcrumb"
      desc="Middle items collapse behind an ellipsis once the trail is longer than maxItems (default 4)."
    >
      <Breadcrumb items={short} />
      <Breadcrumb items={long} />
    </ComponentCard>
  );
}

function ActionsButtonDemo() {
  const [log, setLog] = useState<string | null>(null);

  return (
    <ComponentCard
      title="ActionsButton"
      desc="Ellipsis trigger that opens a Dropdown of actions. actions is required — always pass at least one. Actions with variant: 'danger' are grouped at the bottom, separated by a divider."
    >
      <ActionsButton
        actions={[
          { label: "Edit", icon: <Settings className="size-4" />, path: "#" },
          { label: "Notify", icon: <Bell className="size-4" />, action: () => setLog("Notify clicked") },
          { label: "Remove", icon: <X className="size-4" />, variant: "danger", action: () => setLog("Remove clicked") },
        ]}
      />
      {log && <Text>Last action: {log}</Text>}
    </ComponentCard>
  );
}

function DropdownDemo() {
  const { isOpen, toggle, close } = useDropdownToggle();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [log, setLog] = useState<string | null>(null);

  return (
    <ComponentCard
      title="Dropdown & DropdownItem"
      desc="A basic popup menu. Select, MultiSelect, and ActionsButton are all built using it. It attaches to a button you pick, and moves itself so it always stays fully on screen."
    >
      <button
        ref={anchorRef}
        onClick={toggle}
        className="dropdown-toggle inline-flex items-center justify-center rounded-lg border border-input bg-card px-4 py-2.5 text-sm font-medium text-foreground"
      >
        Toggle dropdown
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={close}
        anchorRef={anchorRef}
        className="flex w-48 flex-col gap-1 p-2"
      >
        <DropdownItem onClick={() => setLog("Profile clicked")} onItemClick={close}>
          Profile
        </DropdownItem>
        <DropdownItem onClick={() => setLog("Settings clicked")} onItemClick={close}>
          Settings
        </DropdownItem>
        <DropdownItem tag="a" href="#" onItemClick={close}>
          Link item (tag=&quot;a&quot;)
        </DropdownItem>
      </Dropdown>
      {log && <Text>Last action: {log}</Text>}
    </ComponentCard>
  );
}

function ModalDemo() {
  const { isOpen, openModal, closeModal } = useModal();
  const { isOpen: isFullscreenOpen, openModal: openFullscreen, closeModal: closeFullscreen } = useModal();

  return (
    <ComponentCard
      title="Modal"
      desc="Centered overlay dialog. isFullscreen skips the backdrop/rounded card for a full-viewport panel."
    >
      <div className="flex flex-wrap gap-3">
        <Button onClick={openModal}>Open modal</Button>
        <Button variant="outline" onClick={openFullscreen}>
          Open fullscreen
        </Button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md p-6">
        <H2>Modal title</H2>
        <Text>This is a regular, centered Modal.</Text>
      </Modal>

      <Modal isOpen={isFullscreenOpen} onClose={closeFullscreen} isFullscreen>
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-surface">
          <H2>Fullscreen modal</H2>
          <Button variant="outline" onClick={closeFullscreen}>
            Close
          </Button>
        </div>
      </Modal>
    </ComponentCard>
  );
}

function ConfirmDialogDemo() {
  const confirm = useModal();
  const dangerConfirm = useModal();
  const [log, setLog] = useState<string | null>(null);

  return (
    <ComponentCard
      title="ConfirmDialog"
      desc="A Modal preset for confirm/cancel steps. isDanger styles the confirm button for destructive actions."
    >
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={confirm.openModal}>
          Confirm action
        </Button>
        <Button variant="outline" onClick={dangerConfirm.openModal}>
          Delete item
        </Button>
      </div>

      <ConfirmDialog
        isOpen={confirm.isOpen}
        onClose={confirm.closeModal}
        onConfirm={() => {
          setLog("Confirmed");
          confirm.closeModal();
        }}
        title="Save changes?"
        message="Your changes will be applied immediately."
      />

      <ConfirmDialog
        isOpen={dangerConfirm.isOpen}
        onClose={dangerConfirm.closeModal}
        onConfirm={() => {
          setLog("Deleted");
          dangerConfirm.closeModal();
        }}
        title="Delete this item"
        message="This action cannot be undone."
        confirmLabel="Delete"
        isDanger
      />

      {log && <Text>Last action: {log}</Text>}
    </ComponentCard>
  );
}

function ComponentCardDemo() {
  return (
    <ComponentCard
      title="ComponentCard"
      desc="The card wrapping every section on this page. title + optional desc in the header, arbitrary content below."
    >
      <ComponentCard title="Nested example" desc="A ComponentCard rendered inside a ComponentCard.">
        <Text>Any content can go here — text, form fields, other components.</Text>
      </ComponentCard>
    </ComponentCard>
  );
}

function SelectionBarDemo() {
  const [count, setCount] = useState(0);

  return (
    <ComponentCard
      title="SelectionBar"
      desc="Fixed to the bottom of the viewport (not this card) while count > 0 — use the buttons below to try it."
    >
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          -
        </Button>
        <Text>{count} selected</Text>
        <Button size="sm" variant="outline" onClick={() => setCount((c) => c + 1)}>
          +
        </Button>
      </div>
      <SelectionBar count={count} onDelete={() => setCount(0)} onClear={() => setCount(0)} />
    </ComponentCard>
  );
}
