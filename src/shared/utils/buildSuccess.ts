import { Right } from '@shared/types/Right';

export function buildSuccess<L, R>(value: R): Right<L, R> {
  return new Right<L, R>(value);
}
