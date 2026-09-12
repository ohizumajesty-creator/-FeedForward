import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeGeminiModel, safeGeminiError } from '../lib/gemini-config.ts';

test('normalizes runtime model names and blank defaults', () => {
  for (const value of ['gemini-2.5-flash', ' models/gemini-2.5-flash\n', '  gemini-2.5-flash  ', undefined, '   ']) {
    assert.equal(normalizeGeminiModel(value), 'gemini-2.5-flash');
  }
});
test('preserves useful Gemini errors without leaking keys or other fields', () => {
  assert.equal(safeGeminiError({error:{message:'GenerateContentRequest.model: unexpected model name format',details:'private'}},'test-secret'), 'GenerateContentRequest.model: unexpected model name format');
  assert.equal(safeGeminiError({error:{message:'Key test-secret rejected\nAIzaFakeCredential',details:'private'}},'test-secret'), 'Key [redacted] rejected [redacted]');
  for (const payload of [null, {}, {error:null}, {error:{message:42}}]) assert.equal(safeGeminiError(payload,'secret'),undefined);
});
