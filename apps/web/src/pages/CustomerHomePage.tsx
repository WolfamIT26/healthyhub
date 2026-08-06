import { EmptyState } from '../components/foundation/EmptyState';
import { LoadingState } from '../components/foundation/LoadingState';

export function CustomerHomePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Khu khách hàng</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Layout này giữ chỗ cho hồ sơ, đơn hàng, giỏ hàng, yêu thích và thông báo sau này.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <EmptyState
          title="Chưa triển khai nghiệp vụ khách hàng"
          description="Prompt 14 chỉ tạo nền tảng. Các màn hình thật sẽ được triển khai theo Feature Specification."
        />
        <div className="rounded-md border border-leaf-100 bg-white p-6 shadow-soft">
          <LoadingState label="Kiểm tra trạng thái tải nền..." />
        </div>
      </div>
    </main>
  );
}
