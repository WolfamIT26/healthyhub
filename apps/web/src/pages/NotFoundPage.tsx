import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="max-w-md rounded-md border border-slate-200 bg-white p-6 text-center shadow-soft">
        <p className="text-sm font-semibold text-leaf-700">404</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Đường dẫn này chưa được định nghĩa trong application shell.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex rounded-md bg-leaf-600 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-700"
        >
          Về trang chính
        </Link>
      </section>
    </main>
  );
}
