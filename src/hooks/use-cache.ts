import CacheService from "@/services/cache-service";

export default function useCache() {
  return CacheService.getInstance();
}
