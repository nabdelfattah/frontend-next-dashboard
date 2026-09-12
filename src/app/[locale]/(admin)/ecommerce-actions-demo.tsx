"use client";

import PageHeading from "@/foundation/shared/components/page-heading";
import { showToast } from "@/foundation/shared/stores/toast-store";

export default function EcommerceActionsDemo() {
  function addNew() {
    showToast({
      variant: "success",
      title: "Added",
      message: "The new item was added successfully.",
    });
  }

  return (
    <PageHeading actions={[{ label: "Add", action: addNew }]}>
      helloWorld
    </PageHeading>
  );
}
