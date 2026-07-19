// ── STORAGE SERVICE ───────────────────────────────────────────
// makeStorage(user) returns a scoped save/load interface.
// All keys are prefixed with lowercase username + "_ob6_"
// to isolate each user's data within shared storage space.
// Uses localStorage for persistence.

export function makeStorage(user) {
  const pfx = (user || 'guest').toLowerCase() + '_ob6_';

  return {

    save(k, v) {
      try {
        localStorage.setItem(pfx + k, JSON.stringify(v));
        return Promise.resolve({ key: pfx + k, value: JSON.stringify(v) });
      } catch (e) {
        return Promise.resolve(null);
      }
    },

    load(k, def) {
      try {
        const val = localStorage.getItem(pfx + k);
        return Promise.resolve(val !== null ? JSON.parse(val) : def);
      } catch {
        return Promise.resolve(def);
      }
    },

    saveDay(dateISO, dayData) {
      return this.save('day_' + dateISO, dayData);
    },

    loadDay(dateISO, def) {
      return this.load('day_' + dateISO, def || {});
    },

    addToList(key, dateISO) {
      // loads list, adds dateISO if not present, saves
      return this.load(key, []).then(arr => {
        if (!arr.includes(dateISO)) {
          arr = [...arr, dateISO];
          return this.save(key, arr);
        }
        return Promise.resolve(arr);
      });
    },

    loadList(key) {
      return this.load(key, []);
    }

  };
}
