const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('./model.js');
test('initial data, fixed date and overdue count', () => {
 const s=M.fresh(); assert.equal(s.objects.length,5); assert.equal(M.overdueDays(s.objects.find(i=>i.id==='C04')),3); assert.equal(M.overdueDays(s.objects[1]),0); assert.equal(M.TODAY,'2026-11-13');
});
test('search name, accents, code and status', () => {
 assert.equal(M.search(M.fresh().objects,'maquina','all')[0].id,'M03'); assert.equal(M.search(M.fresh().objects,'f01','available')[0].name,'Furadeira'); assert.equal(M.search(M.fresh().objects,'f01','loaned').length,0);
});
test('loan demands person and real date on or after demonstration date', () => {
 assert.ok(M.validateLoan(' ','2026-11-13').person); assert.ok(M.validateLoan('João','2026-11-12').due); assert.ok(M.validateLoan('João','2026-02-30').due); assert.deepEqual(M.validateLoan('João','2026-11-13'),{});
});
test('loan updates only intended object and history, preserving original for cancellation/review', () => {
 const original=M.fresh(); const before=JSON.stringify(original); const next=M.transact(original,'F01','loan',{person:' Ana ',due:'2026-11-16'}); assert.equal(JSON.stringify(original),before); assert.equal(next.objects[0].loan.person,'Ana'); assert.equal(next.objects[0].history.length,1); assert.deepEqual(next.objects[1],original.objects[1]);
});
test('unavailable and maintenance objects cannot be lent', () => {
 for(const id of ['P02','E05']) assert.throws(()=>M.transact(M.fresh(),id,'loan',{person:'Ana',due:'2026-11-14'}));
});
test('return, persistence roundtrip and undo restore borrower, due date and history', () => {
 const original=M.fresh(); const next=M.transact(original,'C04','return'); const item=next.objects.find(i=>i.id==='C04'); assert.equal(item.status,'available'); assert.equal(item.history[0].kind,'return'); assert.equal(item.history.length,2); const persisted=M.decode(JSON.stringify(next)); const undone=M.undo(persisted); assert.deepEqual(undone.objects,original.objects); assert.equal(undone.lastOperation,null);
});
test('undo only reverts the latest action and is itself persisted', () => {
 const first=M.transact(M.fresh(),'F01','loan',{person:'Ana',due:'2026-11-14'}); const second=M.transact(first,'P02','return'); const reverted=M.decode(JSON.stringify(M.undo(second))); assert.deepEqual(reverted.objects,first.objects); assert.throws(()=>M.undo(reverted));
});
test('invalid persisted data is rejected', () => {
 assert.throws(()=>M.decode('null')); assert.throws(()=>M.decode('{')); const s=M.fresh(); s.objects[0].name='Wrong'; assert.throws(()=>M.decode(JSON.stringify(s)));
});
