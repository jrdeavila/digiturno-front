// This instance use navigator.hid.requestDevice() to request a HID device.

export interface QualificationModuleLifecycle {
  onError: (error: DOMException) => void;
  onQualified: (qualification: number) => void;
}

export default class QualificationModuleService {
  private static instance: QualificationModuleService;
  private qualificationModule: HIDDevice | undefined;
  private isConnected: boolean = false;

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
      // Request Device
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
      this.qualificationModule = devices[0];
      return this.qualificationModule;
    } catch (error) {
      this.qualificationModule = undefined;
      return undefined;
    }
  }

  public hasQualificationModule(): boolean {
    return this.qualificationModule !== undefined;
  }

  public async connect(lifecycle: QualificationModuleLifecycle): Promise<void> {
    if (this.qualificationModule) {
      try {
        if (!this.isConnected) {
          await this.qualificationModule.open();
          this.isConnected = true;
        }
        this.qualificationModule.oninputreport = (event: {
          data: DataView;
        }) => {
          const { data } = event;
          const arr = new Int8Array(data.buffer);
          const option: number = arr[0];
          lifecycle.onQualified(option);
        };
      } catch (error) {
        lifecycle.onError(error as DOMException);
      }
    }
  }

  public disconnect(): void {
    if (this.qualificationModule) {
      this.qualificationModule.oninputreport = null;
    }
  }
}
