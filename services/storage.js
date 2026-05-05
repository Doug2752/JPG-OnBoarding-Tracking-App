// ── STORAGE SERVICE ───────────────────────────────────────────
// makeStorage(user) returns a scoped save/load interface.
// All keys are prefixed with lowercase username + "_ob6_"
// to isolate each user's data within shared storage space.
// Depends on: window.storage (polyfill defined in index.html)

export function makeStorage(user) {
  const pfx = (user || 'guest').toLowerCase() + '_ob6_';

  return {

    save(k, v) {
      try {
        return window.storage.set(pfx + k, JSON.stringify(v));
      } catch (e) {
        return Promise.resolve(null);
      }
    },

    load(k, def) {
      return window.storage.get(pfx + k)
        .then(r => r ? JSON.parse(r.value) : def)
        .catch(() => def);
    }

  };
}
