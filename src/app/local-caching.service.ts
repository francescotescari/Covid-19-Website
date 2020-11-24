import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LocalCachingService {

  storage = localStorage;

  constructor() {

  }

  getOrSet<T>(key: string, cacheDuration = 3600, getter: () => T): T {
    let value = this.get<T>(key, cacheDuration);
    if (!value) {
      value = getter();
      this.set(key, value);
    }
    return value;
  }

  get<T>(key: string, cacheDuration = 3600): T {
    const cached = this.storage.getItem(key);
    if (cached) {
      try {
        const encoded = JSON.parse(cached);
        if (encoded.time + cacheDuration < Math.floor(Date.now() / 1000)) {
          this.remove(key);
          return null;
        }
        return encoded.data as T;
      } catch (e) {
        this.remove(key);
      }
    }
    return null;
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  set<T>(key: string, data: T): void {
    this.storage.setItem(key, JSON.stringify({time: Math.floor(Date.now() / 1000), data}));
  }

}
