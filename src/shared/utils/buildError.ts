import { Left } from '@shared/types/Left';

export function buildError<L, R>(error: L): Left<L, R> {
  return new Left<L, R>(error);
}
