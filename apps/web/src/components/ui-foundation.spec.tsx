import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Alert, Button, FormField, Input, Modal, Pagination, PasswordInput } from './index';

describe('HealthyHub shared UI foundation', () => {
  it('Button supports interaction, loading and disabled semantics', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Lưu</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Lưu' }));
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<Button loading>Lưu</Button>);
    expect(screen.getByRole('button', { name: 'Đang xử lý…' })).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('Input composes with FormField helper and error semantics', () => {
    const { rerender } = render(<FormField id="email" label="Email" helperText="Dùng email đang hoạt động."><Input id="email" /></FormField>);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText('Dùng email đang hoạt động.')).toBeInTheDocument();
    rerender(<FormField id="email" label="Email" error="Email không hợp lệ."><Input id="email" error aria-describedby="email-error" /></FormField>);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email không hợp lệ.')).toHaveAttribute('id', 'email-error');
  });

  it('PasswordInput is hidden by default and keyboard toggles visibility', async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Mật khẩu" defaultValue="secret-value" />);
    const input = screen.getByLabelText('Mật khẩu');
    expect(input).toHaveAttribute('type', 'password');
    await user.tab();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('secret-value');
    await user.keyboard('{Enter}');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('Modal has dialog semantics, viewport bounds and Escape close', async () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="Xác nhận"><p>Nội dung hộp thoại</p></Modal>);
    const dialog = screen.getByRole('dialog', { name: 'Xác nhận' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.className).toContain('max-h-[calc(100dvh-2rem)]');
    expect(dialog).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('Alert exposes safe status roles', () => {
    const { rerender } = render(<Alert tone="error">Không thể lưu.</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('Không thể lưu.');
    rerender(<Alert tone="success">Đã lưu.</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Đã lưu.');
  });

  it('Pagination announces the current page and changes page', async () => {
    function Harness() {
      const [page, setPage] = useState(2);
      return <Pagination page={page} pageCount={3} onPageChange={setPage} />;
    }
    render(<Harness />);
    expect(screen.getByRole('button', { name: 'Trang 2' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Trang 3' }));
    expect(screen.getByRole('button', { name: 'Trang 3' })).toHaveAttribute('aria-current', 'page');
  });
});
