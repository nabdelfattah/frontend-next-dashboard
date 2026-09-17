import CheckboxComponents from "@/foundation/shared/components/form/form-elements/checkbox-components";
import DefaultInputs from "@/foundation/shared/components/form/form-elements/default-inputs";
import DropzoneComponent from "@/foundation/shared/components/form/form-elements/drop-zone";
import FileInputExample from "@/foundation/shared/components/form/form-elements/file-input-example";
import InputGroup from "@/foundation/shared/components/form/form-elements/input-group";
import InputStates from "@/foundation/shared/components/form/form-elements/input-states";
import RadioButtons from "@/foundation/shared/components/form/form-elements/radio-buttons";
import SelectInputs from "@/foundation/shared/components/form/form-elements/select-inputs";
import TextAreaInput from "@/foundation/shared/components/form/form-elements/text-area-input";
import ToggleSwitch from "@/foundation/shared/components/form/form-elements/toggle-switch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <DefaultInputs />
          <SelectInputs />
          <TextAreaInput />
          <InputStates />
        </div>
        <div className="space-y-6">
          <InputGroup />
          <FileInputExample />
          <CheckboxComponents />
          <RadioButtons />
          <ToggleSwitch />
          <DropzoneComponent />
        </div>
      </div>
    </div>
  );
}
