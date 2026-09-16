import React, { FC } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Styled native file input.
 *
 * @param className - Additional classes merged onto the `<input>`.
 * @param onChange - Native file input change handler.
 *
 * @example
 * <FileInput onChange={(e) => setFile(e.target.files?.[0])} />
 */
const FileInput: FC<FileInputProps> = ({ className, onChange }) => {
  return (
    <input
      type="file"
      className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-input bg-input-background text-sm text-foreground shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-border file:bg-muted file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-muted-foreground placeholder:text-placeholder hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 ${className}`}
      onChange={onChange}
    />
  );
};

export default FileInput;
