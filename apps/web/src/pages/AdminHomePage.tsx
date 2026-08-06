import { EmptyState } from '../components/foundation/EmptyState';

export function AdminHomePage() {
  return (
    <main className="px-4 py-8 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf-700">
          Back office foundation
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Dashboard nền</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Khu vực quản trị đã có layout và route guard foundation. Chưa có quản lý sản phẩm, đơn
          hàng, thanh toán hoặc AI.
        </p>
      </div>
      <EmptyState
        title="Chưa có dữ liệu quản trị"
        description="Các module admin sẽ được phát triển sau khi hoàn thành Authentication và phân quyền."
      />
    </main>
  );
}
