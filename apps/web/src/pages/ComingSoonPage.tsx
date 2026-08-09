import { Link } from 'react-router-dom';

import { buttonClassName, Card } from '../components';

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <main className="container flex flex-1 items-center justify-center py-16">
      <Card className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-700">Nền tảng giao diện</p>
        <h1 className="mt-3 text-3xl font-bold text-neutral-950">{title}</h1>
        <p className="mt-3 leading-7 text-neutral-600">Khu vực này đang được chuẩn bị. Homepage chỉ giới thiệu nội dung và chưa triển khai nghiệp vụ của module.</p>
        <Link to="/" className={buttonClassName({ className: 'mt-6' })}>Về trang chủ</Link>
      </Card>
    </main>
  );
}
