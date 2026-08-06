import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
      <section className="flex flex-col justify-center gap-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-leaf-700">
          Nền tảng đang sẵn sàng phát triển
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
          HealthyHub
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-700">
          Workspace web đã có layout, routing, API client và các trạng thái nền để bắt đầu triển
          khai module Authentication ở bước tiếp theo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/customer"
            className="rounded-md bg-leaf-600 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-700"
          >
            Xem khu khách hàng
          </Link>
          <Link
            to="/admin"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
          >
            Xem khu quản trị
          </Link>
        </div>
      </section>
      <section className="grid gap-4">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-slate-950">Frontend foundation</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            React Router, Axios, Tailwind, error boundary, toast, loading và empty state đã sẵn
            sàng.
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-slate-950">API contract</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Web client dùng API base URL từ environment và chuẩn hóa lỗi theo envelope.
          </p>
        </div>
      </section>
    </main>
  );
}
