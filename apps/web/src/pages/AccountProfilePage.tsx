import { useCallback, useEffect, useState, type FormEvent } from 'react';

import { Alert, Button, Card, ErrorState, FormField, Input, Skeleton } from '../components';
import { useToast } from '../components/foundation/ToastProvider';
import { AccountShell } from '../features/customer/AccountShell';
import { customerApi } from '../features/customer/customerApi';
import type { CustomerProfile } from '../features/customer/customer.types';

export function AccountProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await customerApi.getProfile();
      setProfile(result);
      setForm({ fullName: result.fullName, phone: result.phone ?? '' });
    } catch (loadError) {
      setError(message(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await customerApi.updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || null,
      });
      setProfile(updated);
      setForm({ fullName: updated.fullName, phone: updated.phone ?? '' });
      toast.notify('Cập nhật hồ sơ thành công.', 'success');
    } catch (saveError) {
      setError(message(saveError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountShell
      title="Hồ sơ cá nhân"
      description="Cập nhật tên và số điện thoại liên hệ. Email đăng nhập được quản lý bởi Authentication và chỉ hiển thị để tham khảo."
    >
      {loading ? (
        <Card aria-label="Đang tải hồ sơ">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-6 h-12" />
          <Skeleton className="mt-4 h-12" />
          <Skeleton className="mt-4 h-12" />
        </Card>
      ) : error && !profile ? (
        <ErrorState
          title="Không thể tải hồ sơ"
          description={error}
          action={<Button onClick={() => void load()}>Thử lại</Button>}
        />
      ) : profile ? (
        <Card>
          <h2 className="text-xl font-bold">Thông tin tài khoản</h2>
          <p className="mt-1 text-sm text-neutral-600">Các trường có dấu * có thể cập nhật.</p>
          {error ? (
            <Alert tone="error" className="mt-5" title="Không thể lưu hồ sơ">
              {error}
            </Alert>
          ) : null}
          <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
            <FormField id="profile-full-name" label="Họ và tên" required error={errors.fullName}>
              <Input
                id="profile-full-name"
                value={form.fullName}
                maxLength={255}
                autoComplete="name"
                error={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'profile-full-name-error' : undefined}
                onChange={(event) => {
                  setForm((current) => ({ ...current, fullName: event.target.value }));
                  setErrors((current) => ({ ...current, fullName: undefined }));
                }}
              />
            </FormField>
            <FormField id="profile-phone" label="Số điện thoại" error={errors.phone}>
              <Input
                id="profile-phone"
                value={form.phone}
                maxLength={32}
                inputMode="tel"
                autoComplete="tel"
                error={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'profile-phone-error' : undefined}
                onChange={(event) => {
                  setForm((current) => ({ ...current, phone: event.target.value }));
                  setErrors((current) => ({ ...current, phone: undefined }));
                }}
              />
            </FormField>
            <FormField
              id="profile-email"
              label="Email đăng nhập"
              helperText="Email chỉ đọc. Prompt 29 không triển khai Change Email."
              className="sm:col-span-2"
            >
              <Input id="profile-email" value={profile.email} readOnly autoComplete="email" />
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit" loading={saving}>
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Card>
      ) : null}
    </AccountShell>
  );
}

function validateProfile(form: { fullName: string; phone: string }) {
  const errors: { fullName?: string; phone?: string } = {};
  if (!form.fullName.trim()) errors.fullName = 'Vui lòng nhập họ và tên.';
  const phone = form.phone.trim().replace(/[\s()-]/g, '');
  if (phone && !/^(?:0\d{9,10}|\+84\d{9,10})$/.test(phone)) {
    errors.phone = 'Số điện thoại Việt Nam không hợp lệ.';
  }
  return errors;
}

function message(error: unknown): string {
  return error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
    ? error.message
    : 'Không thể kết nối máy chủ.';
}
