# Import Export Convention / Quy ước import/export

## Purpose / Mục tiêu

Import/export convention giúp dependency rõ, tránh vòng lặp và giữ ranh giới module.

## Import Direction / Hướng import

- Shared utility có thể được import bởi module khi không chứa business rule riêng.
- Module không import sâu vào private implementation của module khác.
- Frontend page import module public surface hoặc component dùng chung, không import file nội bộ tùy tiện.
- Backend controller import service/application layer, không import repository trực tiếp nếu không thuộc pattern đã duyệt.

## Export Rule / Quy tắc export

- Mỗi module nên có public surface rõ khi cần chia sẻ.
- Không export mọi file chỉ để tiện import.
- Type/constant dùng chung phải có owner rõ.
- Không export provider adapter trực tiếp cho business module nếu phải đi qua gateway abstraction.

## Circular Dependency / Phụ thuộc vòng

- Không chấp nhận circular dependency giữa module.
- Nếu hai module cần dữ liệu của nhau, phải dùng contract, service boundary hoặc event pattern đã được quyết định.
- Nếu dependency mới làm phá kiến trúc, phải tạo decision trước khi triển khai.

## Path Rule / Quy tắc đường dẫn

- Không dùng import tương đối quá sâu nếu project đã có alias được duyệt ở phase implementation.
- Alias phải được cấu hình nhất quán giữa app, test và build.
- Không tạo alias riêng cho từng developer.

