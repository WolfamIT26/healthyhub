import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PasswordField } from './PasswordField';

function PasswordFieldHarness() {
  const [value, setValue] = useState('River@Stone-2026');
  return <PasswordField id="password" label="Mật khẩu" value={value} onChange={setValue} />;
}

describe('PasswordField', () => {
  it('is hidden by default and toggles visibility without changing its value', async () => {
    render(<PasswordFieldHarness />);
    const input = screen.getByLabelText('Mật khẩu');
    const toggle = screen.getByRole('button', { name: 'Hiện mật khẩu' });

    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveValue('River@Stone-2026');
    input.focus();
    await userEvent.click(toggle);
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('River@Stone-2026');

    await userEvent.click(screen.getByRole('button', { name: 'Ẩn mật khẩu' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('supports keyboard focus and activation', async () => {
    const user = userEvent.setup();
    render(<PasswordFieldHarness />);
    await user.tab();
    await user.tab();
    const toggle = screen.getByRole('button', { name: 'Hiện mật khẩu' });
    expect(toggle).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByLabelText('Mật khẩu')).toHaveAttribute('type', 'text');
  });
});
