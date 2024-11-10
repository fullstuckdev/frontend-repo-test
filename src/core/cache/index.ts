interface CacheOptions {
  ttl?: number; 
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL = 5 * 60 * 1000; 

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set<T>(key: string, value: T, options: CacheOptions = {}): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string, options: CacheOptions = {}): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const ttl = options.ttl || this.defaultTTL;
    if (Date.now() - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = CacheService.getInstance(); 