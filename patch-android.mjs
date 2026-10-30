// Thêm quyền Bluetooth vào AndroidManifest.xml (chạy lại nhiều lần vẫn an toàn)
import fs from 'node:fs';

const path = 'android/app/src/main/AndroidManifest.xml';
if (!fs.existsSync(path)) { console.error('Chưa có thư mục android. Chạy "npm run android:add" trước.'); process.exit(1); }
let xml = fs.readFileSync(path, 'utf8');

const lines = [
  '<uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />',
  '<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />',
  '<uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" tools:targetApi="s" />',
  '<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />',
  '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="30" />',
  '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />',
  '<uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />',
];

if (!xml.includes('xmlns:tools=')) xml = xml.replace('<manifest ', '<manifest xmlns:tools="http://schemas.android.com/tools" ');
const missing = lines.filter((l) => !xml.includes('"' + l.match(/android:name="([^"]+)"/)[1] + '"'));
if (missing.length) xml = xml.replace('</manifest>', '    ' + missing.join('\n    ') + '\n</manifest>');
fs.writeFileSync(path, xml);
console.log(missing.length ? `Đã thêm ${missing.length} dòng quyền.` : 'Quyền đã đủ.');
