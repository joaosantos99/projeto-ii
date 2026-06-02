import dragonfly from '../redis.js';

class CacheService {
  /**
   * @param {Object} opts
   * @param {string} opts.namespace - Key prefix for primary entries.
   * @param {string} [opts.indexNamespace] - Key prefix for secondary index sets.
   * @param {string} [opts.label] - Log prefix (defaults to `namespace`).
   */
  constructor({ namespace, indexNamespace, label } = {}) {
    this.namespace = namespace;
    this.indexNamespace = indexNamespace;
    this.label = label ?? namespace;
  }

  key(id) {
    return `${this.namespace}:${id}`;
  }

  indexKey(id) {
    return `${this.indexNamespace}:${id}`;
  }

  /**
   * Read and JSON-parse an entry.
   * @returns {Promise<any|null>} - The value, or null on miss / failure.
   */
  async get(id) {
    if (!dragonfly) return null;

    try {
      const raw = await dragonfly.get(this.key(id));
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error(`[${this.label}] get failed:`, error.message);
      return null;
    }
  }

  /**
   * Store an entry. Omit `ttlSec` for a persistent key; a non-positive `ttlSec`
   * is a no-op (already expired).
   */
  async set(id, value, ttlSec) {
    if (!dragonfly) return;
    if (ttlSec != null && ttlSec <= 0) return;

    try {
      if (ttlSec != null) {
        await dragonfly.set(this.key(id), JSON.stringify(value), 'EX', ttlSec);
      } else {
        await dragonfly.set(this.key(id), JSON.stringify(value));
      }
    } catch (error) {
      console.error(`[${this.label}] set failed:`, error.message);
    }
  }

  /**
   * Store an entry and index its id under `indexId` so the whole group can be
   * invalidated together via `invalidateIndex`.
   */
  async setIndexed(id, value, ttlSec, indexId) {
    if (!dragonfly || ttlSec <= 0) return;

    try {
      await dragonfly
        .multi()
        .set(this.key(id), JSON.stringify(value), 'EX', ttlSec)
        .sadd(this.indexKey(indexId), id)
        .expire(this.indexKey(indexId), ttlSec)
        .exec();
    } catch (error) {
      console.error(`[${this.label}] indexed set failed:`, error.message);
    }
  }

  /** Remove a single entry. */
  async del(id) {
    if (!dragonfly) return;

    try {
      await dragonfly.del(this.key(id));
    } catch (error) {
      console.error(`[${this.label}] del failed:`, error.message);
    }
  }

  /** Drop every entry indexed under `indexId`, plus the index set itself. */
  async invalidateIndex(indexId) {
    if (!dragonfly) return;

    try {
      const ids = await dragonfly.smembers(this.indexKey(indexId));
      const keys = ids.map((id) => this.key(id));
      keys.push(this.indexKey(indexId));
      await dragonfly.del(...keys);
    } catch (error) {
      console.error(`[${this.label}] index invalidation failed:`, error.message);
    }
  }
}

export default CacheService;
