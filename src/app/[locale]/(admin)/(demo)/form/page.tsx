"use client";

import { useState } from "react";
import {
  Text,
  PageHeading,
  Button,
  ComponentCard,
  Form,
  Label,
  MultiSelect,
  Select,
  PhoneInput,
  Checkbox,
  FileInput,
  Input,
  Radio,
  RadioSm,
  TextArea,
  Switch,
  DatePicker,
} from "@shared/components";

/**
 * Form component gallery / style guide for the team.
 *
 * Every ready-to-use form component that lives in
 * `src/foundation/shared/components/form` is demoed here with its main
 * variants, so you can see what's available and how to use it before
 * building a new form from scratch.
 *
 * Import everything shown here from the shared barrel:
 * `import { Input, Select, ... } from "@shared/components";`
 */
export default function FormComponentsPage() {
  return (
    <div className="space-y-6">
      <PageHeading breadCrumbItems={[{ label: "Home", path: "/" }, { label: "Form" }]}>
        Form
      </PageHeading>

      <Text>
        Live examples of every ready-to-use form component in{" "}
        <code>src/foundation/shared/components/form</code>.
      </Text>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <FormDemo />
        <ChoiceControlsDemo />
        <SelectDemo />
        <PhoneInputDemo />
        <FileInputDemo />
        <DatePickerDemo />
      </div>
    </div>
  );
}

function FormDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <ComponentCard
      title="Form, Label & Input"
      desc="Form prevents default submission for you. Input supports success/error/disabled states with an optional hint."
    >
      <Form
        onSubmit={(e) => {
          const data = new FormData(e.currentTarget);
          setSubmitted(String(data.get("name") ?? ""));
        }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="demo-name">Name</Label>
          <Input id="demo-name" name="name" placeholder="Jane Doe" />
        </div>
        <Button type="submit" size="sm">
          Submit
        </Button>
      </Form>
      {submitted !== null && <Text>Submitted: {submitted || "(empty)"}</Text>}

      <div className="space-y-3">
        <Input placeholder="Default" />
        <Input placeholder="Success" success hint="Looks good!" />
        <Input placeholder="Error" error hint="This field is required." />
        <Input placeholder="Disabled" disabled />
        <TextArea placeholder="Textarea — error state" error hint="Message is too short." />
      </div>
    </ComponentCard>
  );
}

function ChoiceControlsDemo() {
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("free");
  const [radioSmValue, setRadioSmValue] = useState("sm");
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <ComponentCard
      title="Checkbox, Radio, RadioSm & Switch"
      desc="Choice controls, all controlled components."
    >
      <div className="flex flex-wrap items-center gap-4">
        <Checkbox checked={checked} onChange={setChecked} label="Checkbox" />
        <Checkbox checked={false} indeterminate onChange={() => {}} label="Indeterminate" />
        <Checkbox checked disabled onChange={() => {}} label="Disabled" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Radio id="plan-free" name="plan" value="free" checked={radioValue === "free"} label="Free" onChange={setRadioValue} />
        <Radio id="plan-pro" name="plan" value="pro" checked={radioValue === "pro"} label="Pro" onChange={setRadioValue} />
        <Radio id="plan-disabled" name="plan" value="disabled" checked={false} label="Disabled" onChange={() => {}} disabled />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <RadioSm id="size-sm" name="size" value="sm" checked={radioSmValue === "sm"} label="Small" onChange={setRadioSmValue} />
        <RadioSm id="size-md" name="size" value="md" checked={radioSmValue === "md"} label="Medium" onChange={setRadioSmValue} />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Switch label="Blue" defaultChecked={switchOn} onChange={setSwitchOn} />
        <Switch label="Gray" color="gray" />
        <Switch label="Disabled" disabled />
      </div>
    </ComponentCard>
  );
}

function SelectDemo() {
  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
  ];
  const countryOptions = [
    { value: "eg", text: "Egypt", selected: false },
    { value: "us", text: "United States", selected: false },
    { value: "de", text: "Germany", selected: false },
  ];

  return (
    <ComponentCard
      title="Select & MultiSelect"
      desc="Select: single value, styled like a native select. MultiSelect: multiple values shown as removable chips."
    >
      <div>
        <Label>Role</Label>
        <Select options={roleOptions} onChange={() => {}} placeholder="Choose a role" />
      </div>
      <MultiSelect label="Countries" options={countryOptions} onChange={() => {}} />
    </ComponentCard>
  );
}

function PhoneInputDemo() {
  const countries = [
    { code: "US", label: "+1" },
    { code: "EG", label: "+20" },
    { code: "DE", label: "+49" },
  ];

  return (
    <ComponentCard
      title="PhoneInput"
      desc="Phone field with a country-code dropdown. selectPosition places it at the start or end."
    >
      <PhoneInput countries={countries} onChange={() => {}} />
      <PhoneInput countries={countries} onChange={() => {}} selectPosition="end" />
    </ComponentCard>
  );
}

function FileInputDemo() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ComponentCard title="FileInput" desc="Styled native file input.">
      <FileInput onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      {fileName && <Text>Selected: {fileName}</Text>}
    </ComponentCard>
  );
}

function DatePickerDemo() {
  return (
    <ComponentCard title="DatePicker" desc="flatpickr-backed date input with a label and calendar icon.">
      <DatePicker id="demo-date" label="Start date" placeholder="Select a date" />
    </ComponentCard>
  );
}
