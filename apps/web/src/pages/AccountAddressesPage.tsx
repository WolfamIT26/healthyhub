import { useCallback, useEffect, useState, type FormEvent } from 'react';

import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  FormField,
  Input,
  Modal,
  Skeleton,
  Textarea,
} from '../components';
import { useToast } from '../components/foundation/ToastProvider';
import { AccountShell } from '../features/customer/AccountShell';
import { customerApi, mutationKey } from '../features/customer/customerApi';
import type { CustomerAddress, CustomerAddressInput } from '../features/customer/customer.types';

const emptyForm: CustomerAddressInput = {
  recipientName: '',
  phone: '',
  countryCode: 'VN',
  provinceCity: '',
  district: '',
  ward: '',
  addressLine: '',
  note: '',
  isDefault: false,
};

export function AccountAddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CustomerAddress | 'new' | null>(null);
  const [deleting, setDeleting] = useState<CustomerAddress | null>(null);
  const [pendingAddressId, setPendingAddressId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAddresses(await customerApi.listAddresses());
    } catch (loadError) {
      setError(message(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function makeDefault(address: CustomerAddress) {
    setPendingAddressId(address.addressId);
    setError(null);
    try {
      await customerApi.updateAddress(address.addressId, { isDefault: true });
      await load();
      toast.notify('Đã đặt địa chỉ mặc định.', 'success');
    } catch (saveError) {
      setError(message(saveError));
    } finally {
      setPendingAddressId(null);
    }
  }

  async function remove() {
    if (!deleting) return;
    setPendingAddressId(deleting.addressId);
    try {
      await customerApi.deleteAddress(deleting.addressId);
      setDeleting(null);
      await load();
      toast.notify('Đã xóa địa chỉ.', 'success');
    } catch (deleteError) {
      setError(message(deleteError));
      setDeleting(null);
    } finally {
      setPendingAddressId(null);
    }
  }

  return (
    <AccountShell
      title="Địa chỉ nhận hàng"
      description="Quản lý địa chỉ Việt Nam đã lưu. Checkout chỉ dùng địa chỉ được chọn để điền dữ liệu; đơn hàng vẫn giữ snapshot bất biến."
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-600">{addresses.length} địa chỉ đang hoạt động</p>
        <Button onClick={() => setEditing('new')}>Thêm địa chỉ</Button>
      </div>
      {error ? (
        <Alert tone="error" title="Không thể hoàn tất yêu cầu" className="mb-5">
          {error}
        </Alert>
      ) : null}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2" aria-label="Đang tải địa chỉ">
          <AddressSkeleton />
          <AddressSkeleton />
        </div>
      ) : error && addresses.length === 0 ? (
        <ErrorState
          title="Không thể tải sổ địa chỉ"
          description={error}
          action={<Button onClick={() => void load()}>Thử lại</Button>}
        />
      ) : addresses.length === 0 ? (
        <EmptyState
          title="Chưa có địa chỉ đã lưu"
          description="Thêm địa chỉ đầu tiên để điền nhanh thông tin nhận hàng tại Checkout."
          action={<Button onClick={() => setEditing('new')}>Thêm địa chỉ đầu tiên</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.addressId} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-neutral-950">{address.recipientName}</h2>
                {address.isDefault ? <Badge tone="success">Mặc định</Badge> : null}
              </div>
              <address className="mt-3 flex-1 text-sm not-italic leading-6 text-neutral-700">
                <p>{address.phone}</p>
                <p>{address.addressLine}</p>
                <p>
                  {[address.ward, address.district, address.provinceCity]
                    .filter(Boolean)
                    .join(', ')}
                </p>
                {address.note ? (
                  <p className="mt-2 text-neutral-500">Ghi chú: {address.note}</p>
                ) : null}
              </address>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-neutral-200 pt-4">
                <Button variant="outline" size="sm" onClick={() => setEditing(address)}>
                  Chỉnh sửa
                </Button>
                {!address.isDefault ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={pendingAddressId === address.addressId}
                    onClick={() => void makeDefault(address)}
                  >
                    Đặt mặc định
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={() => setDeleting(address)}>
                  Xóa
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <AddressEditor
        value={editing}
        onClose={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await load();
          toast.notify('Đã lưu địa chỉ.', 'success');
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => void remove()}
        title="Xóa địa chỉ?"
        description="Địa chỉ sẽ được xóa khỏi sổ địa chỉ. Snapshot của các đơn hàng cũ không thay đổi."
        confirmLabel="Xóa địa chỉ"
        danger
        pending={Boolean(deleting && pendingAddressId === deleting.addressId)}
      />
    </AccountShell>
  );
}

function AddressEditor({
  value,
  onClose,
  onSaved,
}: {
  value: CustomerAddress | 'new' | null;
  onClose(): void;
  onSaved(): Promise<void>;
}) {
  const [form, setForm] = useState<CustomerAddressInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!value) return;
    setForm(
      value === 'new'
        ? { ...emptyForm }
        : {
            recipientName: value.recipientName,
            phone: value.phone,
            countryCode: 'VN',
            provinceCity: value.provinceCity,
            district: value.district,
            ward: value.ward ?? '',
            addressLine: value.addressLine,
            note: value.note ?? '',
            isDefault: value.isDefault,
          },
    );
    setErrors({});
    setError(null);
  }, [value]);

  function field(name: keyof CustomerAddressInput, inputValue: string | boolean) {
    setForm((current) => ({ ...current, [name]: inputValue }));
    setErrors((current) => ({ ...current, [name]: '' }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validateAddress(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    setError(null);
    const input = normalizeAddress(form);
    try {
      if (value === 'new') {
        await customerApi.createAddress(input, mutationKey('address-create'));
      } else if (value) {
        await customerApi.updateAddress(value.addressId, input);
      }
      await onSaved();
    } catch (saveError) {
      setError(message(saveError));
    } finally {
      setSaving(false);
    }
  }

  const textFields: Array<{
    name: keyof CustomerAddressInput;
    label: string;
    maxLength: number;
    autoComplete?: string;
  }> = [
    { name: 'recipientName', label: 'Người nhận', maxLength: 255, autoComplete: 'name' },
    { name: 'phone', label: 'Số điện thoại', maxLength: 32, autoComplete: 'tel' },
    {
      name: 'provinceCity',
      label: 'Tỉnh / Thành phố',
      maxLength: 150,
      autoComplete: 'address-level1',
    },
    { name: 'district', label: 'Quận / Huyện', maxLength: 150, autoComplete: 'address-level2' },
    { name: 'ward', label: 'Phường / Xã', maxLength: 150, autoComplete: 'address-level3' },
    {
      name: 'addressLine',
      label: 'Số nhà, tên đường',
      maxLength: 500,
      autoComplete: 'street-address',
    },
  ];

  return (
    <Modal
      open={Boolean(value)}
      onClose={onClose}
      title={value === 'new' ? 'Thêm địa chỉ' : 'Chỉnh sửa địa chỉ'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form="customer-address-form" loading={saving}>
            Lưu địa chỉ
          </Button>
        </>
      }
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
      <form
        id="customer-address-form"
        className="mt-4 grid gap-4 sm:grid-cols-2"
        onSubmit={submit}
        noValidate
      >
        {textFields.map(({ name, label, maxLength, autoComplete }) => {
          const id = `address-${name}`;
          return (
            <FormField
              key={name}
              id={id}
              label={label}
              required={name !== 'ward'}
              error={errors[name]}
              className={name === 'addressLine' ? 'sm:col-span-2' : undefined}
            >
              <Input
                id={id}
                value={String(form[name] ?? '')}
                maxLength={maxLength}
                autoComplete={autoComplete}
                inputMode={name === 'phone' ? 'tel' : undefined}
                error={Boolean(errors[name])}
                onChange={(event) => field(name, event.target.value)}
              />
            </FormField>
          );
        })}
        <FormField id="address-note" label="Ghi chú giao hàng" className="sm:col-span-2">
          <Textarea
            id="address-note"
            value={form.note ?? ''}
            maxLength={500}
            onChange={(event) => field('note', event.target.value)}
          />
        </FormField>
        <div className="sm:col-span-2">
          <Checkbox
            checked={Boolean(form.isDefault)}
            disabled={value !== 'new' && value?.isDefault}
            onChange={(event) => field('isDefault', event.target.checked)}
            label="Đặt làm địa chỉ mặc định"
          />
        </div>
      </form>
    </Modal>
  );
}

function AddressSkeleton() {
  return (
    <Card>
      <Skeleton className="h-6 w-40" />
      <Skeleton className="mt-4 h-4 w-32" />
      <Skeleton className="mt-2 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </Card>
  );
}

function validateAddress(form: CustomerAddressInput): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of ['recipientName', 'provinceCity', 'district', 'addressLine'] as const) {
    if (!form[field].trim()) errors[field] = 'Trường này là bắt buộc.';
  }
  const phone = form.phone.trim().replace(/[\s()-]/g, '');
  if (!/^(?:0\d{9,10}|\+84\d{9,10})$/.test(phone)) {
    errors.phone = 'Số điện thoại Việt Nam không hợp lệ.';
  }
  return errors;
}

function normalizeAddress(form: CustomerAddressInput): CustomerAddressInput {
  return {
    ...form,
    recipientName: form.recipientName.trim(),
    phone: form.phone.trim().replace(/[\s()-]/g, ''),
    provinceCity: form.provinceCity.trim(),
    district: form.district.trim(),
    ward: form.ward?.trim() || undefined,
    addressLine: form.addressLine.trim(),
    note: form.note?.trim() || undefined,
  };
}

function message(error: unknown): string {
  return error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
    ? error.message
    : 'Không thể kết nối máy chủ.';
}
