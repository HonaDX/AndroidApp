// Lớp tương thích: đưa BLE gốc của Android về cùng giao diện với Web Bluetooth,
// để phần còn lại của index.html không phải sửa. Trên Chrome (không phải app) file này không làm gì.
import { Capacitor } from '@capacitor/core';
import { BleClient } from '@capacitor-community/bluetooth-le';

if (Capacitor.isNativePlatform()) {
  const SERVICE = '7a1f0001-8c3b-4d5e-9f10-a1b2c3d4e5f6';
  let inited = false;

  const toView = (d) => new DataView(d.buffer, d.byteOffset, d.byteLength);

  class Chr {
    constructor(deviceId, service, uuid) { this.id = deviceId; this.svc = service; this.uuid = uuid; }
    writeValueWithResponse(d) { return BleClient.write(this.id, this.svc, this.uuid, toView(d)); }
    writeValueWithoutResponse(d) { return BleClient.writeWithoutResponse(this.id, this.svc, this.uuid, toView(d)); }
    readValue() { return BleClient.read(this.id, this.svc, this.uuid); }   // trả về DataView như Web Bluetooth
  }

  class Dev extends EventTarget {
    constructor(info) {
      super();
      this.id = info.deviceId;
      this.name = info.name || '';
      const self = this;
      this.gatt = {
        connected: false,
        async connect() {
          await BleClient.connect(self.id, () => self._lost(), { timeout: 10000 });
          this.connected = true;
          return {
            getPrimaryService: async (svc) => ({
              getCharacteristic: async (uuid) => new Chr(self.id, svc, uuid),
            }),
          };
        },
        disconnect() {
          BleClient.disconnect(self.id).catch(() => {}).finally(() => self._lost());
        },
      };
    }
    _lost() {   // chỉ phát sự kiện một lần cho mỗi lần ngắt
      if (!this.gatt.connected) return;
      this.gatt.connected = false;
      this.dispatchEvent(new Event('gattserverdisconnected'));
    }
  }

  window.nativeBluetooth = {
    async requestDevice() {
      if (!inited) {
        await BleClient.initialize({ androidNeverForLocation: true });   // xin quyền Bluetooth lúc chạy
        inited = true;
      }
      try {
        const info = await BleClient.requestDevice({ services: [SERVICE] });   // hộp chọn thiết bị gốc, chỉ hiện đúng UUID
        return new Dev(info);
      } catch (e) {
        if (/cancel/i.test(String(e?.message || e))) { const err = new Error('cancelled'); err.name = 'NotFoundError'; throw err; }
        throw e;
      }
    },
  };
}
