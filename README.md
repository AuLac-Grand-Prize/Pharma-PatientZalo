# Pharma Patient Zalo Mini App

> **Lớp Platform của PharmLink AI dành cho 100 triệu người dân Việt Nam.**
> Zalo Mini App — kênh tiếp cận trực tiếp bệnh nhân qua ứng dụng đã quen thuộc nhất ở VN.

---

## 1. Tại sao Zalo Mini App?

- **75 triệu+ người dùng Zalo tại VN** — kể cả ông bà, người vùng nông thôn đều dùng.
- **Không cần cài app riêng** — nâng tỷ lệ adoption gấp 5-10 lần so với native app.
- **Tích hợp sẵn**: thanh toán ZaloPay, OA push, login bằng SĐT Zalo.
- **Kích thước < 4MB** — chạy mượt trên điện thoại cấu hình thấp.

## 2. Tính năng chính

### Hồ sơ sức khỏe cá nhân
- Lịch sử thuốc đã mua (liên thông giữa các nhà thuốc PharmLink).
- Lịch sử tiêm chủng (sổ vaccine điện tử).
- Dị ứng thuốc, bệnh mãn tính, chỉ số sức khỏe.

### Nhắc nhở thông minh
- Nhắc uống thuốc đúng giờ (push qua Zalo OA).
- Nhắc tái khám, đo huyết áp, đo đường huyết.
- SMS phụ huynh/con cháu khi đến lịch ông bà mua thuốc (cho người già).

### Hỏi đáp dược sĩ AI 24/7
- Tích hợp **PharmaGPT-VN** qua API Gateway.
- Câu hỏi tiếng Việt tự nhiên: "metformin uống lúc nào?", "đau đầu nên uống gì?".
- Mọi câu trả lời lâm sàng đều có disclaimer + link gặp dược sĩ thật khi cần.

### Cảnh báo an toàn thuốc
- Khi mua thuốc mới → **VietDrug AI** check tương tác với thuốc đang dùng.
- Cảnh báo "thuốc này đã thu hồi" theo cập nhật từ Bộ Y tế.

### Đặt thuốc giao nhanh
- Tìm nhà thuốc gần nhất có sẵn thuốc.
- Đặt qua app, shipper Ahamove/Grab/Be giao 30 phút.
- Thanh toán ZaloPay/Momo.

## 3. Stack công nghệ

| Layer | Tech |
|-------|------|
| Framework | ZMP React (Zalo Mini Program SDK) |
| Build | Vite 5 |
| Language | TypeScript 5.x |
| State | Zustand |
| UI | ZMP UI components + TailwindCSS |
| Routing | ZMP Router (file-based) |
| API | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Tests | Vitest |

> **Lưu ý**: Zalo Mini Program có một số ràng buộc: không hỗ trợ một số Web API của browser, mọi network call phải qua endpoint đã whitelist trong Zalo Developer Console.

## 4. Cấu trúc thư mục

```
pharma-patient-zalo/
├── src/
│   ├── App.tsx                # Root + router setup
│   ├── main.tsx               # ZMPSDK init
│   ├── pages/                 # File-based routing
│   │   ├── home.tsx
│   │   ├── profile/index.tsx
│   │   ├── medications/index.tsx
│   │   ├── reminders/index.tsx
│   │   ├── ask-pharmacist.tsx
│   │   └── orders/[id].tsx
│   ├── components/
│   │   ├── HealthCard.tsx
│   │   ├── MedicationItem.tsx
│   │   ├── ChatMessage.tsx
│   │   └── PharmacyMap.tsx
│   ├── services/              # API client + Zalo SDK helpers
│   │   ├── api.ts
│   │   ├── zalo-auth.ts
│   │   └── zalopay.ts
│   ├── store/                 # Zustand
│   ├── hooks/
│   ├── utils/
│   └── types/
├── public/
├── app-config.json            # Zalo Mini App manifest
├── vite.config.mts
└── package.json
```

## 5. Khởi chạy

### Yêu cầu
- Node.js 20+
- Tài khoản Zalo Developer + App ID
- ZMP CLI: `pnpm dlx zmp-cli@latest`

### Setup
```bash
cp .env.example .env.local
pnpm install
pnpm dev                     # http://localhost:3001 (preview trên Zalo Studio)
pnpm zmp:deploy --staging    # deploy lên môi trường staging Zalo
```

### Test trên Zalo thật
Sau khi `zmp:deploy`, mở **Zalo → Mã QR Mini App** (cung cấp bởi Zalo Developer Console) để test trực tiếp trên điện thoại.

## 6. Tích hợp các engine AI (qua API Gateway)

Mini App **không** có quyền gọi trực tiếp AI services — mọi request đi qua `pharma-api-gateway`:

```ts
// services/api.ts
const askPharmacist = (question: string) =>
  api.post("/patient/ask-pharmacist", { question });

const checkSafety = (newMed: string) =>
  api.post("/patient/check-safety", { newMed });
```

API Gateway xác thực user qua **Zalo OAuth** (lấy `accessToken` từ ZMP SDK) rồi gọi PharmaGPT-VN/VietDrug AI nội bộ.

## 7. Bảo mật & quyền riêng tư

- Mọi PII (tên, SĐT, mã BHYT, tiền sử bệnh) chỉ lưu trên server PharmLink (data center VN).
- Mini App chỉ giữ token + cache UI ngắn hạn — không lưu PII trên device.
- Bệnh nhân có thể **xóa toàn bộ dữ liệu của mình** từ trong Mini App (quyền theo Nghị định 13/2023).
- Push qua Zalo OA chỉ chứa **gợi ý thời gian** — không bao giờ gửi tên thuốc cụ thể qua Zalo (tránh leak qua thông báo lock screen).

## 8. UX cho người cao tuổi & vùng nông thôn

- **Cỡ chữ tối thiểu 16px**, có toggle "Tăng cỡ chữ".
- **Voice input** cho mục Ask Pharmacist.
- **Hoạt động được khi mạng yếu** — cache câu trả lời thường gặp offline.
- **Single-tap** đặt thuốc theo lịch sử, không bắt người dùng nhập lại tên thuốc.

## 9. Roadmap

- **v0.1**: Hồ sơ + lịch sử thuốc + reminder.
- **v0.2**: Ask Pharmacist với PharmaGPT-VN + cảnh báo VietDrug AI.
- **v0.3**: Đặt thuốc + ZaloPay + shipper.
- **v1.0**: Sổ vaccine điện tử + tích hợp BHYT (qua API Gateway).
