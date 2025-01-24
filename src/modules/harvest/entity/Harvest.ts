import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';

@Entity()
export class Harvest {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'uuid' })
  uuid: string = uuid();

  @Property()
  name!: string;

  @Property()
  description!: string;

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

  @OneToMany(() => RuralPropertie, (ruralPropertie) => ruralPropertie.harvest)
  ruralProperties = new Collection<RuralPropertie>(this);
}
