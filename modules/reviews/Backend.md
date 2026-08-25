# Review Backend / Backend Review

## Executable V1 / V1 đã chạy

- Access token/role guards và `CustomerOwnerResolver` resolve owner server-side.
- Customer Order read model owner-scope theo CustomerProfile.
- Persisted Order Items giữ Product reference.

## Executable eligibility foundation / Foundation eligibility đã chạy

`ReviewEligibilityService` resolve Customer owner từ authenticated actor, repository query Order theo tenant/customer, kiểm tra active Order Item Product và đọc Shipment. Policy chỉ trả eligible khi Order `completed`, Shipment `delivered` và cả hai authoritative timestamps tồn tại. Cancelled/returned evidence bị revoke; Order không thuộc owner và Product không thuộc Order fail closed.

`TypeOrmReviewRepository.create` khóa Order rồi Shipment theo cùng thứ tự với Fulfillment, recheck policy và active Order Item trước insert. Exact retry trả cùng Review; payload khác cho cùng Order+Product trả conflict. DB unique là final authority.

Public aggregate/list chỉ đọc `published` chưa soft-delete. Update/delete khóa Review owner-scoped; not-owned và missing cùng trả safe not-found. Verified badge được tính từ Order/Shipment/OrderItem hiện tại nên return thu hồi badge không cần mutation song song.
