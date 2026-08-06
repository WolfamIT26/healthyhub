# Permission Matrix / Ma trận phân quyền

## Permission Principle / Nguyên tắc phân quyền

Phân quyền phải dựa trên vai trò và phạm vi trách nhiệm. UI có thể ẩn chức năng, nhưng quyết định quyền phải được kiểm tra ở backend khi triển khai sau.

## Matrix / Ma trận

| Capability / Năng lực | Guest | Customer | Member | VIP | Staff | Manager | Admin | Super Admin |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| View public products | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Search products | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Use cart | Limited | Yes | Yes | Yes | No | No | No | No |
| Place order | Limited | Yes | Yes | Yes | No | No | No | No |
| View own orders | No | Yes | Yes | Yes | No | No | No | No |
| Review product | No | Yes | Yes | Yes | No | No | No | No |
| Receive loyalty benefits | No | No | Yes | Yes | No | No | No | No |
| Process orders | No | No | No | No | Yes | Yes | Yes | No |
| Manage products | No | No | No | No | Limited | Yes | Yes | No |
| Manage inventory | No | No | No | No | Limited | Yes | Yes | No |
| Manage promotions | No | No | No | No | No | Yes | Yes | No |
| Manage customers | No | No | No | No | Limited | Yes | Yes | No |
| Manage content/blog | No | No | No | No | Limited | Yes | Yes | No |
| View analytics | No | No | No | No | Limited | Yes | Yes | Yes |
| Manage settings | No | No | No | No | No | Limited | Yes | Yes |
| Manage staff roles | No | No | No | No | No | No | Yes | Yes |
| Manage SaaS tenants | No | No | No | No | No | No | No | Yes |
| Approve AI marketing content | No | No | No | No | No | Yes | Yes | No |

## Notes / Ghi chú

- `Limited` nghĩa là quyền bị giới hạn theo phạm vi vận hành cụ thể.
- Super Admin là vai trò chuẩn bị cho SaaS tương lai, chưa phải trọng tâm MVP.
- Các hành động nhạy cảm cần audit log khi triển khai.

