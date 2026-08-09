import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  ErrorState,
  FormField,
  Input,
  Radio,
  Skeleton,
  SuccessState,
  Textarea,
  buttonClassName,
} from '../components';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/CartContext';
import { checkoutApi } from '../features/checkout/checkoutApi';
import type {
  CheckoutAddress,
  CreatedOrder,
  ShippingQuote,
} from '../features/checkout/checkout.types';
import type { NormalizedApiError } from '../services/api/normalizeApiError';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});
type FieldName = Exclude<keyof CheckoutAddress, 'countryCode'>;

export function CheckoutPage() {
  const auth = useAuth();
  const cart = useCart();
  const reloadCart = cart.reload;
  const [address, setAddress] = useState<CheckoutAddress>({
    recipientName: auth.actor?.fullName ?? '',
    phone: '',
    countryCode: 'VN',
    provinceCity: '',
    district: '',
    ward: '',
    addressLine: '',
    note: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [preparing, setPreparing] = useState(true);
  const [quoting, setQuoting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const attemptKey = useRef<string | null>(null);

  const prepare = useCallback(async () => {
    if (!auth.actor?.isEmailVerified) {
      setPreparing(false);
      return;
    }
    setPreparing(true);
    setError(null);
    try {
      await reloadCart();
    } catch (loadError) {
      setError(apiError(loadError));
    } finally {
      setPreparing(false);
    }
  }, [auth.actor?.isEmailVerified, reloadCart]);

  useEffect(() => {
    void prepare();
  }, [prepare]);

  function change(field: FieldName) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAddress((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setQuote(null);
      setError(null);
      attemptKey.current = null;
    };
  }

  async function review(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(address);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setQuoting(true);
    setError(null);
    try {
      const nextQuote = await checkoutApi.quoteShipping(normalized(address));
      setQuote(nextQuote);
      setConfirmOpen(true);
    } catch (quoteError) {
      setError(apiError(quoteError));
    } finally {
      setQuoting(false);
    }
  }

  async function confirm() {
    if (!quote || submitting) return;
    setSubmitting(true);
    setError(null);
    attemptKey.current ??= createAttemptKey();
    try {
      const created = await checkoutApi.createOrder(
        normalized(address),
        quote.quoteReference,
        attemptKey.current,
      );
      setOrder(created);
      setConfirmOpen(false);
    } catch (orderError) {
      const normalizedError = apiError(orderError);
      setError(normalizedError);
      setConfirmOpen(false);
      if (
        normalizedError.code === 'ORDER.SHIPPING_INVALID' ||
        normalizedError.code === 'ORDER.CART_INVALID' ||
        normalizedError.code === 'ORDER.INSUFFICIENT_STOCK'
      ) {
        setQuote(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!auth.actor?.isEmailVerified)
    return (
      <CheckoutShell>
        <ErrorState
          title="Bạn cần xác minh email trước khi thanh toán."
          description="Giỏ hàng vẫn được giữ nguyên. Hãy xác minh Email rồi quay lại Checkout."
          action={
            <Link className={buttonClassName()} to="/verify-email">
              Xác minh ngay
            </Link>
          }
        />
      </CheckoutShell>
    );
  if (order)
    return (
      <CheckoutShell>
        <SuccessState
          title="Đặt hàng thành công"
          description={
            <span>
              Mã đơn <strong>{order.orderNumber}</strong>. Tổng cộng{' '}
              {money.format(Number(order.total))}. Thanh toán khi nhận hàng —{' '}
              {paymentLabel(order.paymentStatus)}. Giao hàng tiêu chuẩn —{' '}
              {shippingLabel(order.shippingMethod)}.
            </span>
          }
          action={
            <div className="flex flex-wrap gap-3">
              <Link to="/customer" className={buttonClassName({ variant: 'secondary' })}>
                Khu vực khách hàng
              </Link>
              <Link to="/products" className={buttonClassName()}>
                Tiếp tục mua sắm
              </Link>
            </div>
          }
        />
      </CheckoutShell>
    );
  if (preparing || cart.loading)
    return (
      <CheckoutShell>
        <div
          aria-label="Đang chuẩn bị Checkout"
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
        >
          <Skeleton className="h-[560px]" />
          <Skeleton className="h-96" />
        </div>
      </CheckoutShell>
    );
  if (cart.error && !cart.cart)
    return (
      <CheckoutShell>
        <ErrorState
          title="Không thể tải Checkout"
          description="Cart server hiện không phản hồi."
          action={
            <Button
              onClick={() => {
                void prepare();
              }}
            >
              Thử lại
            </Button>
          }
        />
      </CheckoutShell>
    );
  if (!cart.items.length || !cart.cart?.isValid)
    return (
      <CheckoutShell>
        <ErrorState
          title={
            cart.items.length ? 'Giỏ hàng cần được kiểm tra lại' : 'Giỏ hàng của bạn đang trống'
          }
          description={
            cart.items.length
              ? 'Sản phẩm, số lượng hoặc tồn kho đã thay đổi. Checkout chưa thể tiếp tục.'
              : 'Hãy thêm sản phẩm trước khi đặt hàng.'
          }
          action={
            <Link to="/cart" className={buttonClassName()}>
              Quay lại giỏ hàng
            </Link>
          }
        />
      </CheckoutShell>
    );

  const cod = { code: 'cod', name: 'Thanh toán khi nhận hàng', enabled: true } as const;
  return (
    <CheckoutShell>
      {error ? (
        <Alert tone="error" className="mb-6" title="Không thể hoàn tất Checkout">
          {errorMessage(error)}{' '}
          <Link className="font-semibold underline" to="/cart">
            Quay lại giỏ hàng
          </Link>
        </Alert>
      ) : null}
      <form
        onSubmit={review}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
        noValidate
      >
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold">Thông tin người nhận</h2>
            <p className="mt-1 text-sm text-neutral-600">Email tài khoản: {auth.actor.email}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CheckoutField
                field="recipientName"
                label="Họ và tên"
                value={address.recipientName}
                error={errors.recipientName}
                onChange={change('recipientName')}
              />
              <CheckoutField
                field="phone"
                label="Số điện thoại"
                value={address.phone}
                error={errors.phone}
                onChange={change('phone')}
                inputMode="tel"
              />
              <CheckoutField
                field="provinceCity"
                label="Tỉnh / Thành phố"
                value={address.provinceCity}
                error={errors.provinceCity}
                onChange={change('provinceCity')}
              />
              <CheckoutField
                field="district"
                label="Quận / Huyện"
                value={address.district}
                error={errors.district}
                onChange={change('district')}
              />
              <CheckoutField
                field="ward"
                label="Phường / Xã (không bắt buộc)"
                value={address.ward ?? ''}
                error={errors.ward}
                onChange={change('ward')}
                required={false}
              />
              <CheckoutField
                field="addressLine"
                label="Địa chỉ cụ thể"
                value={address.addressLine}
                error={errors.addressLine}
                onChange={change('addressLine')}
              />
              <FormField id="checkout-note" label="Ghi chú giao hàng" className="sm:col-span-2">
                <Textarea
                  id="checkout-note"
                  value={address.note ?? ''}
                  maxLength={500}
                  onChange={change('note')}
                />
              </FormField>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-bold">Vận chuyển và thanh toán</h2>
            <div className="mt-4 space-y-3">
              <Radio
                name="shipping"
                checked
                readOnly
                label={
                  quote
                    ? `${quote.methodName} — ${money.format(Number(quote.shippingFee))}`
                    : 'Giao hàng tiêu chuẩn HealthyHub — phí được máy chủ xác nhận sau khi kiểm tra địa chỉ'
                }
              />
              {cod ? (
                <Radio
                  name="payment"
                  checked
                  readOnly
                  label={`${cod.name} — trạng thái ban đầu: Chờ thanh toán`}
                />
              ) : (
                <Alert tone="error">
                  Máy chủ hiện không cung cấp phương thức thanh toán khả dụng.
                </Alert>
              )}
            </div>
          </Card>
        </div>
        <Card className="lg:sticky lg:top-6" aria-label="Tóm tắt đơn hàng">
          <h2 className="text-xl font-bold">Đơn hàng</h2>
          <ul className="mt-4 divide-y divide-neutral-200">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>{money.format(Number(item.lineTotal))}</strong>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <SummaryRow label="Tạm tính" value={cart.cart.subtotal} />
            <SummaryRow label="Phí giao hàng" value={quote?.shippingFee} />
            <div className="border-t border-neutral-200 pt-3">
              <SummaryRow
                label="Tổng cộng dự kiến"
                value={quote ? addMoney(cart.cart.subtotal, quote.shippingFee) : undefined}
                strong
              />
            </div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            Giá và tồn kho sẽ được máy chủ kiểm tra lại khi tạo Order.
          </p>
          <Button
            className="mt-5 w-full"
            type="submit"
            loading={quoting}
            disabled={!cod || submitting}
          >
            {quote ? 'Kiểm tra lại và xác nhận' : 'Kiểm tra giao hàng'}
          </Button>
          <Link
            to="/cart"
            className={buttonClassName({ variant: 'ghost', className: 'mt-2 w-full' })}
          >
            Quay lại giỏ hàng
          </Link>
        </Card>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          if (!submitting) setConfirmOpen(false);
        }}
        onConfirm={() => {
          void confirm();
        }}
        pending={submitting}
        title="Xác nhận đặt hàng"
        confirmLabel="Xác nhận đặt hàng"
        description={
          quote ? (
            <>
              Tổng dự kiến{' '}
              <strong>
                {money.format(Number(addMoney(cart.cart.subtotal, quote.shippingFee)))}
              </strong>
              . Backend sẽ revalidate toàn bộ Cart, giá, tồn kho và Shipping trước khi lưu.
            </>
          ) : null
        }
      />
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 bg-neutral-50">
      <div className="container py-8 sm:py-10">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Giỏ hàng', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />
        <div className="mb-8 mt-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-700">
            Secure Checkout
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Hoàn tất đơn hàng</h1>
        </div>
        {children}
      </div>
    </main>
  );
}
function CheckoutField({
  field,
  label,
  value,
  error,
  onChange,
  required = true,
  inputMode,
}: {
  field: FieldName;
  label: string;
  value: string;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  inputMode?: 'tel';
}) {
  const id = `checkout-${field}`;
  return (
    <FormField id={id} label={label} required={required} error={error}>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={
          field === 'addressLine'
            ? 500
            : field === 'recipientName'
              ? 255
              : field === 'phone'
                ? 32
                : 150
        }
        inputMode={inputMode}
        error={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
    </FormField>
  );
}
function SummaryRow({ label, value, strong }: { label: string; value?: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className={strong ? 'font-bold' : ''}>{label}</dt>
      <dd className={strong ? 'text-lg font-bold text-primary-700' : 'font-semibold'}>
        {value === undefined ? 'Chờ xác nhận' : money.format(Number(value))}
      </dd>
    </div>
  );
}
function validate(address: CheckoutAddress): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const field of [
    'recipientName',
    'phone',
    'provinceCity',
    'district',
    'addressLine',
  ] as FieldName[])
    if (!address[field]?.trim()) errors[field] = 'Trường này là bắt buộc.';
  const phone = address.phone.trim().replace(/[\s()-]/g, '');
  if (address.phone.trim() && !/^(?:0\d{9,10}|\+84\d{9,10})$/.test(phone))
    errors.phone = 'Số điện thoại Việt Nam không hợp lệ.';
  return errors;
}
function normalized(address: CheckoutAddress): CheckoutAddress {
  return Object.fromEntries(
    Object.entries(address).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  ) as unknown as CheckoutAddress;
}
function apiError(error: unknown): { message: string; code?: string } {
  const item = error as Partial<NormalizedApiError>;
  return {
    message: typeof item.message === 'string' ? item.message : 'Không thể kết nối máy chủ.',
    code: item.code,
  };
}
function errorMessage(error: { message: string; code?: string }) {
  if (error.code === 'ORDER.INSUFFICIENT_STOCK')
    return 'Tồn kho đã thay đổi. Vui lòng kiểm tra lại giỏ hàng.';
  if (error.code === 'ORDER.CART_INVALID' || error.code === 'ORDER.CART_EMPTY')
    return 'Giỏ hàng không còn hợp lệ. Vui lòng kiểm tra lại.';
  if (error.code === 'ORDER.SHIPPING_INVALID')
    return 'Địa chỉ giao hàng không hợp lệ hoặc chưa được hỗ trợ.';
  if (error.code === 'ORDER.IDEMPOTENCY_CONFLICT')
    return 'Thông tin của lần đặt hàng đã thay đổi. Vui lòng kiểm tra lại.';
  return error.message;
}
function createAttemptKey() {
  const value =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `checkout-${value}`;
}
function addMoney(left: string, right: string) {
  return (
    ((BigInt(left.replace('.', '')) + BigInt(right.replace('.', ''))) / 100n).toString() +
    '.' +
    ((BigInt(left.replace('.', '')) + BigInt(right.replace('.', ''))) % 100n)
      .toString()
      .padStart(2, '0')
  );
}
function paymentLabel(status: string) {
  return status === 'pending' ? 'Chờ thanh toán' : status;
}
function shippingLabel(method: string) {
  return method === 'manual' ? 'Giao hàng tiêu chuẩn HealthyHub' : method;
}
