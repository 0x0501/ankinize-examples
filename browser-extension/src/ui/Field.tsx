import { Field } from "@base-ui/react/field";
import type { ReactNode } from "react";

interface TextFieldProps {
  label: string;
  hint?: ReactNode;
  /** Render a textarea instead of a single-line input. */
  multiline?: boolean;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  type?: "text" | "password" | "url";
  required?: boolean;
  placeholder?: string;
}

/**
 * A labelled text control. Base UI's Field wires the label, the hint and the
 * validation message to the control, so we only style it.
 */
export function TextField({
  label,
  hint,
  multiline,
  onValueChange,
  ...control
}: TextFieldProps) {
  return (
    <Field.Root className="field" name={control.name}>
      <Field.Label className="field__label">{label}</Field.Label>
      <Field.Control
        className="input"
        render={multiline ? <textarea rows={4} /> : undefined}
        onValueChange={onValueChange}
        {...control}
      />
      {hint ? (
        <Field.Description className="field__hint">{hint}</Field.Description>
      ) : null}
      <Field.Error className="field__error" match="valueMissing">
        This is required.
      </Field.Error>
    </Field.Root>
  );
}
