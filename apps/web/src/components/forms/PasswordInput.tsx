import { forwardRef, useState, type InputHTMLAttributes } from 'react';

import { IconButton } from '../ui/Button';
import { Input } from './FormControls';

export const PasswordInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: boolean; visibilityLabel?: string }
>(function PasswordInput({ error, visibilityLabel = 'mật khẩu', ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        error={error}
        className="pr-12"
        {...props}
      />
      <IconButton
        label={`${visible ? 'Ẩn' : 'Hiện'} ${visibilityLabel}`}
        aria-pressed={visible}
        className="absolute right-0 top-0"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((current) => !current)}
      >
        <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" aria-hidden="true">
          {visible ? (
            <>
              <path d="M3 3l18 18M10.6 10.7a2 2 0 002.8 2.8M6.6 6.6C4.3 8.1 3 10 3 10s3.5 5 9 5a10 10 0 003-.4" />
              <path d="M9.9 4.2A10.8 10.8 0 0112 4c5.5 0 9 5 9 5a15.8 15.8 0 01-3 3.5" />
            </>
          ) : (
            <>
              <path d="M3 12s3.5-5 9-5 9 5 9 5-3.5 5-9 5-9-5-9-5z" />
              <circle cx="12" cy="12" r="2.5" />
            </>
          )}
        </svg>
      </IconButton>
    </div>
  );
});
