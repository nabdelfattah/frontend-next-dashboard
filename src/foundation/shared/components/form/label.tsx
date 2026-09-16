import React, { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable form field label.
 *
 * @param htmlFor - Id of the form control this label describes.
 * @param children - Label text/content.
 * @param className - Additional classes merged onto the label.
 *
 * @example
 * <Label htmlFor="email">Email</Label>
 */
const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        // Default classes that apply by default
        "mb-1.5 block text-sm font-medium text-muted-foreground",

        // User-defined className that can override the default margin
        className
      )}
    >
      {children}
    </label>
  );
};

export default Label;
