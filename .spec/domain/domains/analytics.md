# Analytics Domain / Domain phân tích

## Purpose / Mục đích

Tổng hợp và diễn giải dữ liệu kinh doanh để hỗ trợ quyết định vận hành.

## Responsibility / Trách nhiệm

- Tạo khái niệm chỉ số kinh doanh.
- Tổng hợp sales, customer, inventory, promotion và AI metrics ở mức nghiệp vụ.
- Bảo vệ rule không sửa dữ liệu vận hành.

## Managed Objects / Đối tượng quản lý

- Aggregate Root: `AnalyticsReport`
- Entity: `MetricSnapshot`, `InsightRecord`, `DashboardView`
- Value Object: `MetricValue`, `ReportingPeriod`, `InsightConfidence`
- Enum: `MetricType`, `ReportScope`, `InsightStatus`

## Relationships / Quan hệ với domain khác

- Đọc Order, Product, Inventory, Customer, Promotion.
- AI Analytics tạo insight từ Analytics.
- Dashboard hiển thị analytics theo quyền.

## Business Rule / Quy tắc nghiệp vụ

- Analytics chỉ đọc/tổng hợp, không sửa dữ liệu nguồn.
- Dữ liệu cá nhân cần giảm thiểu hoặc ẩn danh khi phù hợp.
- AI insight chỉ là đề xuất, manager quyết định.

## Domain Event / Sự kiện domain

- `AnalyticsReportGenerated`
- `BusinessInsightCreated`
- `AnomalyDetected`

## Dependency / Phụ thuộc

- Cross-cutting dependency: Order, Product, Inventory, Customer, Promotion, AI

## Boundary / Ranh giới

Analytics không sở hữu dữ liệu gốc. Mọi chỉnh sửa phải thực hiện trong domain nguồn tương ứng.

