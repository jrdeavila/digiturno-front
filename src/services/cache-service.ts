// Cache Service Singleton

export default class CacheService {
  private static instance: CacheService;


  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }

    return CacheService.instance;
  }

  public set(key: string, value: any): void {
    return localStorage.setItem(`cache:${key}`, JSON.stringify(value));
  }

  public get<T>(key: string): T | undefined {
    const item = localStorage.getItem(`cache:${key}`);
    if (item) {
      return JSON.parse(item);
    }
    return undefined;
  }

  public delete(key: string): void {
    return localStorage.removeItem(`cache:${key}`);
  }
}
