import { Left } from './Left';
import { Right } from './Right';

export type Either<L, R> = Left<L, R> | Right<L, R>;
