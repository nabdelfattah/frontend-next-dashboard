import React, { FC, ReactNode, FormEvent } from "react";

interface FormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Form wrapper that always prevents the browser's default submission before
 * calling `onSubmit`.
 *
 * @param onSubmit - Called with the submit event after `preventDefault()` has run.
 * @param children - Form fields.
 * @param className - Additional classes merged onto the `<form>` element.
 *
 * @example
 * <Form onSubmit={handleSubmit}>
 *   <Input name="email" />
 * </Form>
 */
const Form: FC<FormProps> = ({ onSubmit, children, className }) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); // Prevent default form submission
        onSubmit(event);
      }}
      className={` ${className}`} // Default spacing between form fields
    >
      {children}
    </form>
  );
};

export default Form;
