(function (root) {
  'use strict';
  const key = 'vereda.reading.v1';
  function read() {
    try {
      const raw = localStorage.getItem(key);
      return { value: raw ? JSON.parse(raw) : null, available: true, recovered: false };
    } catch (error) {
      return { value: null, available: error instanceof SyntaxError, recovered: error instanceof SyntaxError };
    }
  }
  function write(state) {
    try { localStorage.setItem(key, JSON.stringify(state)); return true; }
    catch (_) { return false; }
  }
  root.VeredaPersistence = { read, write };
})(globalThis);
