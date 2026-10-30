# C3 TFT – app Android (Capacitor)

Tất cả file nằm cùng một thư mục (trừ workflow phải đặt ở `.github/workflows/build-apk.yml`).

Trang `index.html` được đóng gói thành APK. Trong app, Bluetooth dùng plugin BLE gốc
(`ble-native.js`), vì WebView của Android không có Web Bluetooth. Trên Chrome, trang vẫn chạy như cũ.

## Cách 1: build bằng GitHub Actions (không cần cài gì)
1. Tạo repo GitHub, đẩy toàn bộ thư mục này lên nhánh `main`.
2. Vào tab Actions, chạy workflow "Build APK" (tự chạy khi push).
3. Tải artifact `c3-tft-debug-apk`, giải nén lấy `app-debug.apk`, cài lên điện thoại
   (bật "Cài ứng dụng không rõ nguồn gốc").

## Cách 2: build trên máy
Cần Node.js 22, JDK 21, Android Studio (hoặc Android SDK) và biến `ANDROID_HOME`.
```
npm install
npm run android:add     # chỉ chạy lần đầu, tạo thư mục android và thêm quyền
npm run apk:debug       # APK ở android/app/build/outputs/apk/debug/app-debug.apk
```
Sửa `index.html` xong chỉ cần chạy lại `npm run apk:debug`.

## Lưu ý
- APK debug dùng để thử. Để phát hành cần ký APK bằng keystore riêng (`npm run apk:release`, rồi ký).
- Android 12 trở lên: lần đầu bấm "Kết nối Bluetooth" app sẽ xin quyền thiết bị ở gần.
- Phiên bản thư viện đặt theo dạng `^7.0.0`; nếu npm báo xung đột, đổi cả ba gói Capacitor và plugin BLE cùng một bản chính.
- Chưa obfuscate JS. Nếu muốn, làm trước bước `vite build` (vd. plugin `vite-plugin-javascript-obfuscator`).
