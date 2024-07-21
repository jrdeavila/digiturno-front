interface HIDDevice {
  vendorId: number;
  productId: number;
  productName: string;
  open: () => Promise<void>;
  close: () => Promise<void>;
  sendReport: (reportId: number, data: BufferSource) => Promise<void>;
  oninputreport: ((event: HIDInputReportEvent) => void) | null;
}

interface HIDInputReportEvent extends Event {
  readonly device: HIDDevice;
  readonly reportId: number;
  readonly data: DataView;
}

interface HIDConnectionEvent extends Event {
  device: HIDDevice;
}

interface Navigator {
  hid: {
    getDevices: () => Promise<HIDDevice[]>;
    requestDevice: (options: { filters: { vendorId?: number; productId?: number }[] }) => Promise<HIDDevice[]>;
    addEventListener: (type: 'disconnect', listener: (this: HID, ev: HIDConnectionEvent) => any, options?: boolean | AddEventListenerOptions) => void;
    removeEventListener: (type: 'disconnect', listener: (this: HID, ev: HIDConnectionEvent) => any, options?: boolean | EventListenerOptions) => void;
  };
}
