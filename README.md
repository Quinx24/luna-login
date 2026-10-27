# ConnectUs · Nhóm 15

Ứng dụng React + Firebase Authentication + LiveKit. Thành viên: Nguyễn Thị Hoàng Uyên, Võ Thị Kiều Thơ. Chỉnh mảng MEMBERS trong src/group.js để bổ sung thành viên.

## Tình trạng thực tế

- Giữ nguyên signInWithPopup(auth, googleProvider), signInWithPopup(auth, facebookProvider), result.user, signOut(auth), loading và xử lý lỗi ban đầu.
- Dự án được cung cấp thiếu src/firebase.js và chưa cài Firebase. File mới chỉ đọc cấu hình web qua biến môi trường; không tạo tài khoản Firebase mới. Nếu bạn có file firebase.js cũ ở máy khác, có thể phục hồi cấu hình project đó vào file mới.
- Đã tích hợp SDK video thật, token backend kiểm tra Firebase ID token, giới hạn phòng, thời hạn token 10 phút. Không có video hoặc người online giả.
- Chưa có thông tin Firebase, Firebase Admin hay LiveKit thật nên chưa kiểm thử đăng nhập/call hai thiết bị và chưa có link deploy.
- Phòng dùng chung theo tên: mọi người đã đăng nhập và biết tên phòng có thể tham gia. Chưa có quyền riêng tư theo lời mời. Mỗi UID có một phiên LiveKit trong phòng; thử hai người bằng hai tài khoản khác nhau.
- Danh sách trên trang chủ chỉ hiển thị tài khoản hiện tại. Danh sách trong phòng lấy trực tiếp từ LiveKit.

## 1. Cài đặt và chạy local

Dùng Node.js 22.12+ hoặc 24 LTS.

```powershell
npm install firebase @livekit/components-react @livekit/components-styles livekit-client livekit-server-sdk firebase-admin express express-rate-limit dotenv
Copy-Item .env.example .env
```

Điền `.env` theo hướng dẫn dưới. Mở hai terminal ở thư mục dự án:

```powershell
npm run server
```

```powershell
npm run dev
```

Mở địa chỉ Vite in trong terminal. Vite chuyển /api sang localhost:3001. Không dùng npm run preview để kiểm thử backend; dùng hai lệnh trên hoặc build rồi npm start.

## 2. Firebase đang sử dụng

Firebase Console → Project settings → Your apps → Web app: lấy apiKey, authDomain, projectId, appId và điền VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID. Đây là cấu hình web công khai, không phải private key.

Authentication → Sign-in method: kiểm tra Google và Facebook đã bật, giữ các thiết lập hiện có. Authentication → Settings → Authorized domains: thêm localhost và tên miền deploy (chỉ hostname, không có https://).

Facebook: kiểm tra App ID và App secret được đặt trong Firebase Console, không đặt vào React. Meta for Developers → Facebook Login settings: dùng đúng OAuth redirect URI được Firebase hiển thị (thường https://AUTH_DOMAIN/__/auth/handler). Kiểm tra App Domains và Website URL. Khi app Meta ở chế độ development, thử bằng tài khoản có vai trò trong app; để người ngoài đăng nhập cần hoàn thành điều kiện public/app review của Meta phù hợp với ứng dụng.

Firebase Admin: Project settings → Service accounts. Lưu file service-account ngoài repository. Đặt GOOGLE_APPLICATION_CREDENTIALS thành đường dẫn tuyệt đối của file và FIREBASE_PROJECT_ID trùng project frontend. Hoặc đặt FIREBASE_SERVICE_ACCOUNT_JSON thành nội dung JSON trong secret environment của hosting (không dùng đồng thời hai cách). Không gửi private key vào chat, commit hoặc đưa vào biến VITE_.

Nếu có lỗi popup, cho phép popup, thử lại và đọc thông báo trên giao diện. Backend không tin tên/ảnh gửi từ trình duyệt; nó lấy từ Firebase token đã xác thực.

## 3. LiveKit

Tạo/chọn project LiveKit Cloud của nhóm. Trong phần project settings/keys, lấy WebSocket URL dạng wss://... và API key, API secret. Điền LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET trong `.env` backend. Không đặt secret vào src hoặc biến có tiền tố VITE_. Khởi động lại backend sau khi thay đổi.

Token chỉ cho phép publish/subscribe/data và join đúng tên phòng đã yêu cầu. Endpoint yêu cầu Firebase bearer ID token, có rate limit, không cache token. Thời hạn token giới hạn lần tham gia; không tự kết thúc cuộc gọi đang diễn ra sau 10 phút.

## 4. Kiểm tra

```powershell
npm run lint
npm test
npm run build
npm start
```

npm test kiểm tra hợp đồng API bằng Firebase/LiveKit dependency giả lập; không thay thế kiểm thử tài khoản thật. npm start phục vụ cả dist và API tại http://localhost:3001. Dùng HTTPS khi deploy để truy cập camera/micro.

Thử từng bước:
1. Đăng nhập Google rồi đăng xuất; thử lại với Facebook. Kiểm tra tên, email, ảnh và refresh trang giữ phiên đăng nhập.
2. Tạo phòng, sao chép tên phòng hiển thị và gửi cho người thứ hai.
3. Người thứ hai đăng nhập bằng tài khoản khác, nhập cùng tên phòng.
4. Bật micro/camera trên thanh điều khiển LiveKit, cho phép truy cập thiết bị. Kiểm tra nghe/nhìn hai chiều và danh sách participant. Mặc định camera/micro tắt.
5. Thử tắt/bật micro, camera, từ chối quyền thiết bị và mất mạng/kết nối lại. Có thể dùng headphones để tránh tiếng vọng.
6. Rời cuộc gọi: quay lại trang chủ, vẫn đăng nhập. Đăng xuất trong phòng: phòng được unmount/ngắt kết nối.
7. Gửi POST /api/token không có bearer phải trả 401. Tên phòng không hợp lệ trả 400. Chưa cấu hình dịch vụ phải có lỗi rõ ràng, không hiển thị video giả.

## 5. Deploy frontend Vercel + backend Render

Cần tài khoản hosting và repository của bạn; chưa tự deploy vì chưa có cấu hình dịch vụ.

### Backend Render

- Đẩy source lên repository, không commit .env/service-account; chọn New → Web Service → repository.
- Build command: `npm ci`. Start command: `npm start` (backend dùng PORT do Render cung cấp).
- Đặt FIREBASE_PROJECT_ID, FIREBASE_SERVICE_ACCOUNT_JSON, LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET trong Environment secrets. Không cần các biến VITE_ nếu chỉ host API.
- Deploy, lấy URL HTTPS backend, mở /health để kiểm tra tiến trình. /health không xác nhận Firebase/LiveKit đã đúng; cần thử join thật.
- Nếu chạy nhiều instance, dùng rate limit store dùng chung và cấu hình trusted proxy đúng theo nhà cung cấp; không bật trust proxy vô điều kiện.

### Frontend Vercel

- Import cùng repository → Framework Vite → Build `npm run build` → Output `dist`.
- Thêm bốn biến VITE_FIREBASE_* từ cấu hình web Firebase vào Environment Variables.
- Tạo file vercel.json tại gốc bằng nội dung sau, thay YOUR-BACKEND bằng hostname Render thật trước khi deploy:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://YOUR-BACKEND.onrender.com/api/:path*" }
  ]
}
```

Frontend dùng /api/token cùng origin; rewrite chuyển yêu cầu sang backend, không cần CORS mở cho mọi domain. Backend chỉ trả token khi Firebase xác thực thành công. Redeploy Vercel khi đổi biến VITE_.

- Sau deploy, thêm domain .vercel.app hoặc domain riêng vào Firebase Authorized domains, kiểm tra Meta redirect như phần 2.
- Kiểm thử cả Google, Facebook và gọi hai thiết bị trên link HTTPS thật theo phần 4. Sau khi thành công, sao chép Production URL từ Vercel để gửi giảng viên/nhóm.

Có thể host cả frontend/backend trên Render: build `npm ci && npm run build`, start `npm start`, đặt đủ biến VITE_ ở thời điểm build và server secrets ở runtime; không cần Vercel rewrite.

## Các file chính

- src/App.jsx: điều phối màn hình, giữ logic đăng nhập và đăng xuất.
- src/components/LoginPage.jsx, HomePage.jsx, MeetingRoom.jsx, ParticipantList.jsx: giao diện.
- src/components/Shared.jsx: logo, avatar fallback, footer.
- src/group.js: MEMBERS và thông tin nhóm.
- src/firebase.js: cấu hình Firebase web (file này thiếu trong source gốc).
- src/livekitService.js: Firebase bearer token → backend /api/token.
- server/app.js: kiểm tra ID token và cấp token LiveKit.
- server/index.js: tiến trình Express, static frontend và health endpoint.
- src/App.css: responsive, hover/disabled/loading states.
- .env.example: mẫu biến, không chứa credentials.

## Tài liệu chính thức

- https://docs.livekit.io/reference/components/react/component/videoconference/
- https://docs.livekit.io/frontends/reference/tokens-grants/
- https://firebase.google.com/docs/auth/web/facebook-login
- https://support.google.com/firebase/answer/6400741
- https://render.com/docs/deploy-node-express-app
- https://vercel.com/docs/routing/rewrites

## Deploy toàn bộ trên Vercel (API tích hợp)

Dự án hiện có api/token.js dùng lại server/app.js, chạy dưới dạng Vercel Node Function. vercel.json cấu hình frontend Vite và API cùng domain. Với cách này KHÔNG cần Render hoặc rewrite /api sang backend khác. Xóa rewrite cũ chuyển /api sang Render nếu đã thêm khi sử dụng phương án này.

1. Đẩy các file api/token.js, vercel.json và source hiện tại lên repository mà Vercel đang theo dõi.
2. Vercel → Project → Settings → Environment Variables → Production: giữ các VITE_FIREBASE_* đã cấu hình.
3. Thêm các biến SERVER (không có tiền tố VITE_):
   - FIREBASE_PROJECT_ID: luna-c3837
   - FIREBASE_SERVICE_ACCOUNT_JSON: toàn bộ nội dung file service-account JSON hợp lệ, nên nén thành một dòng. Dán trực tiếp vào ô Value trên Vercel, không thêm cặp dấu nháy bên ngoài. Đánh dấu Sensitive nếu có tùy chọn. Không commit file hoặc gửi private key vào chat.
   - LIVEKIT_URL: WebSocket URL dạng wss:// của project LiveKit đang dùng.
   - LIVEKIT_API_KEY và LIVEKIT_API_SECRET: cùng cặp khóa của project LiveKit.
4. Không dùng GOOGLE_APPLICATION_CREDENTIALS trỏ tới đường dẫn C:/... trên Vercel: file đó chỉ tồn tại trên máy local. Dùng FIREBASE_SERVICE_ACCOUNT_JSON ở bước trên.
5. Redeploy sau khi source mới và biến đã lưu. Không cần chạy npm start trên Vercel; nền tảng gọi api/token.js trực tiếp.
6. Kiểm tra POST /api/token không có Authorization phải trả 401 dạng JSON. Nếu 404 hoặc HTML thì function chưa được deploy/routing chưa đúng. Nếu 503, xem thông báo cấu hình Firebase Admin hoặc LiveKit. Vào phòng bằng tài khoản thật để xác nhận thành công, rồi thử hai thiết bị.

Rate limit hiện lưu trong bộ nhớ từng instance, không phải hạn mức dùng chung toàn bộ Vercel. Với nhu cầu production lớn, bổ sung store dùng chung hoặc WAF/rate limiting của hosting.
