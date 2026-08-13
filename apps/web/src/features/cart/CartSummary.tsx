import { Card } from '../../components';

const moneyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export function CartSummary({
  itemCount,
  subtotal,
  action,
}: {
  itemCount: number;
  subtotal: string;
  action: React.ReactNode;
}) {
  return (
    <Card className="lg:sticky lg:top-4" aria-label="Tóm tắt giỏ hàng">
      <h2 className="text-xl font-bold text-neutral-950">Tóm tắt giỏ hàng</h2>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt>Số lượng sản phẩm</dt>
          <dd className="font-semibold">{itemCount}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-neutral-200 pt-4 text-base">
          <dt className="font-bold">Tạm tính</dt>
          <dd className="font-bold text-primary-700">{moneyFormatter.format(Number(subtotal))}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-5 text-neutral-500">
        Giá và tạm tính được máy chủ xác nhận lại từ Product authority. Phí vận chuyển, thuế và ưu
        đãi chưa được tính.
      </p>
      <div className="mt-5">{action}</div>
    </Card>
  );
}
