import * as Redis from "ioredis";
import {redisHost, redisPort} from "./configuration";

export class CacheManager {
  redisClient: Redis.Redis = null;
  constructor() {
    this.redisClient = new Redis(redisPort, redisHost);
  }

  setResult(siteName: string, result: object): void {
    this.redisClient.set(siteName, JSON.stringify(result), "EX", 24 * 60 * 60);
  }

  clearCache(): void {
    this.redisClient
      .flushall()
      .then(value => console.log("Cache cleaned! " + value))
      .catch(err => console.log(err));
  }

  async getResult(siteName: string): Promise<object> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(siteName, (err: Error, res: string) => {
        if (err) {
          reject(err);
        }
        return resolve(JSON.parse(res));
      });
    });
  }
}
