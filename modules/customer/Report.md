# Customer Ownership Authority Report

**Status: READY for Cart consumption.**

`customer_profiles.user_account_id` có unique ownership mapping và FK tới Authentication account. `CustomerOwnerResolver` chỉ nhận authenticated context, yêu cầu CUSTOMER role và trả active CustomerProfile; không nhận owner ID từ request.

Register lifecycle đã tạo CustomerProfile. Email verification không tham gia owner resolution, nên unverified Customer vẫn dùng Cart; internal account không được map thành Customer.
