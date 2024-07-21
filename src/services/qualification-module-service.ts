// This instance use navigator.hid.requestDevice() to request a HID device.

interface QualificationModuleLifecycle {
  onConnect: (device: HIDDevice) => void;
  onDisconnect: (device: HIDDevice) => void;
  onError: (error: DOMException) => void;
  onInputReport: (device: HIDDevice, reportId: number, data: DataView) => void;
}

export default class QualificationModuleService {
  private static instance: QualificationModuleService;
  private qualificationModule: HIDDevice | undefined;

  private constructor() {
    this.getQualificationModule();
  }

  public static getInstance(): QualificationModuleService {
    if (!QualificationModuleService.instance) {
      QualificationModuleService.instance = new QualificationModuleService();
    }

    return QualificationModuleService.instance;
  }

  public async requestQualificationModule(): Promise<boolean> {
    try {
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x461 }],
      });
      if (devices.length > 0) {
        this.qualificationModule = devices[0];
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      this.qualificationModule = undefined;
      return false;
    }
  }

  public async getQualificationModule(): Promise<HIDDevice | undefined> {
    try {
      const devices = await navigator.hid.getDevices();
      this.qualificationModule = devices.find(
        (device) => device.vendorId === 0x461
      );
      return this.qualificationModule;
    } catch (error) {
      console.error(error);
      this.qualificationModule = undefined;
      return undefined;
    }
  }

  public hasQualificationModule(): boolean {
    return this.qualificationModule !== undefined;
  }

  public connect(lifecycle: QualificationModuleLifecycle): void {
    if (this.qualificationModule) {
      this.qualificationModule.addEventListener("connect", () => {
        lifecycle.onConnect(this.qualificationModule);
      });
      this.qualificationModule.addEventListener("disconnect", () => {
        lifecycle.onDisconnect(this.qualificationModule);
      });
      this.qualificationModule.addEventListener("inputreport", (event) => {
        lifecycle.onInputReport(
          this.qualificationModule,
          event.reportId,
          event.data
        );
      });
    }
  }
}
