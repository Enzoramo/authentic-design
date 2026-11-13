(function (root) {
  'use strict';
  const DURATION = 1120;
  const INITIAL = [
    { id: 'opening', time: 0, title: 'Abertura' },
    { id: 'first-try', time: 200, title: 'A primeira tentativa' },
    { id: 'change', time: 495, title: 'Quando o plano muda' },
    { id: 'remains', time: 850, title: 'O que ficou' }
  ];
  const clone = chapters => chapters.map(chapter => ({ ...chapter }));
  const formatTime = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  function parseTime(input) {
    if (!/^\d{2}:[0-5]\d$/.test(input)) return { error: 'Use mm:ss, com segundos entre 00 e 59. Por exemplo: 05:30.' };
    const [minutes, seconds] = input.split(':').map(Number);
    const value = minutes * 60 + seconds;
    if (value >= DURATION) return { error: 'O capítulo precisa começar antes de 18:40. O último horário possível é 18:39.' };
    return { value };
  }
  function validateDraft(chapters, draft) {
    const errors = {};
    const title = draft.title.trim();
    if (!title) errors.title = 'Dê um título a este capítulo.';
    else if (/[\r\n]/.test(title)) errors.title = 'Escreva o título em uma única linha.';
    const parsed = parseTime(draft.time);
    if (parsed.error) errors.time = parsed.error;
    else if (draft.id === chapters[0].id && parsed.value !== 0) errors.time = 'O primeiro capítulo precisa permanecer em 00:00.';
    else if (chapters.some(chapter => chapter.id !== draft.id && chapter.time === parsed.value)) errors.time = `Já existe um capítulo em ${draft.time}. Escolha outro horário.`;
    return { errors, value: { id: draft.id, title, time: parsed.value } };
  }
  function saveDraft(chapters, draft, newId) {
    const result = validateDraft(chapters, draft);
    if (Object.keys(result.errors).length) return result;
    const found = chapters.some(chapter => chapter.id === draft.id);
    const item = { ...result.value, id: found ? draft.id : newId };
    const next = found ? chapters.map(chapter => chapter.id === draft.id ? item : { ...chapter }) : [...clone(chapters), item];
    return { chapters: next.sort((a, b) => a.time - b.time), id: item.id, errors: {} };
  }
  function removeChapter(chapters, id) {
    if (id === chapters[0].id) throw new Error('O primeiro capítulo não pode ser excluído.');
    if (!chapters.some(chapter => chapter.id === id)) throw new Error('Capítulo não encontrado.');
    return clone(chapters.filter(chapter => chapter.id !== id));
  }
  function intervals(chapters) {
    return chapters.map((chapter, index) => ({ ...chapter, end: chapters[index + 1]?.time ?? DURATION, duration: (chapters[index + 1]?.time ?? DURATION) - chapter.time }));
  }
  const exportText = chapters => chapters.map(chapter => `${formatTime(chapter.time)} ${chapter.title}`).join('\n') + '\n';
  function validChapters(chapters) {
    if (!Array.isArray(chapters) || !chapters.length || !chapters[0] || chapters[0].time !== 0) return false;
    const ids = new Set();
    return chapters.every((chapter, index) => {
      if (!chapter || typeof chapter.id !== 'string' || !chapter.id || ids.has(chapter.id)) return false;
      ids.add(chapter.id);
      return Number.isInteger(chapter.time) && chapter.time >= 0 && chapter.time < DURATION &&
        (!index || chapters[index - 1].time < chapter.time) && typeof chapter.title === 'string' &&
        !!chapter.title.trim() && !/[\r\n]/.test(chapter.title);
    });
  }
  const api = { DURATION, INITIAL, clone, formatTime, parseTime, validateDraft, saveDraft, removeChapter, intervals, exportText, validChapters };
  root.MinutoModel = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
