import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

@Entity()
export class Producer {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'uuid' })
  uuid: string = uuid();

  @Property()
  @Unique()
  cprOrCnpj!: string;

  @Property()
  name!: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    onUpdate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date = new Date();

  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
