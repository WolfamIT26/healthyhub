import { FormField, PasswordInput } from '../../components';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange(value: string): void;
  error?: string;
  autoComplete?: string;
}

export function PasswordField({ id, label, value, onChange, error, autoComplete }: PasswordFieldProps) {
  return (
    <FormField id={id} label={label} error={error}>
      <PasswordInput
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        error={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        visibilityLabel={label.toLocaleLowerCase('vi-VN')}
      />
    </FormField>
  );
}
