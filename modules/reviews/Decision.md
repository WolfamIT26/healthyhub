# Review Decision / Quyết định Review

## D-REV-001 — Do not infer purchase completion / Không suy diễn hoàn tất mua hàng

**Historical Prompt 33 decision:** BLOCKED until Order/Shipment owns an executable completed/delivered transition.

`confirmed`, Payment `paid`, OrderPlaced và stock `consumed` không được chọn làm Review eligibility vì chúng không chứng minh Customer đã nhận Product và không đồng nhất giữa COD/VNPAY.

## Prompt 33.1 canonical decisions / Quyết định chuẩn

1. Eligible only when owned Order is `completed`, Shipment is `delivered`, both timestamps exist and active Order Item contains Product.
2. Cancelled/returned fulfillment revokes eligibility. Existing content remains public but loses verified-purchase evidence; Payment refund alone is not fulfillment evidence.
3. Duplicate identity is `Order + Product`, allowing a later fulfilled purchase occasion to be reviewed separately while collapsing duplicate lines within one Order.
4. Publication default is `published`; owner edit remains published in place; owner delete is soft delete.

## D-REV-002 — Prompt 33.2 implementation decisions

1. Unique identity vẫn được giữ sau owner soft delete; V1 không undelete/recreate một identity đã dùng.
2. Exact concurrent duplicate create trả cùng Review khi normalized rating/content giống nhau; conflicting duplicate trả 409.
3. Public author là generic safe label, không expose Customer PII/internal ID.
4. Rating summary được query trực tiếp từ active/published persistence; không ghi aggregate cache trong V1.
5. Product Detail dùng Review endpoints riêng, không thêm rating fixture vào Product response.
