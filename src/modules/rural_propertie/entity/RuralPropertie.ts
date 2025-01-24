import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';
import { Harvest } from '@modules/harvest/entity/Harvest';

@Entity()
export class RuralPropertie {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'uuid' })
  uuid: string = uuid();

  @Property()
  name!: string;

  @Property()
  city!: string;

  @Property()
  state!: string;

  @Property({ type: 'decimal', precision: 20, scale: 2 })
  totalAreaFarm!: number;

  @Property({ type: 'decimal', precision: 20, scale: 2 })
  arableArea!: number;

  @Property({ type: 'decimal', precision: 20, scale: 2 })
  vegetationArea!: number;

  @ManyToOne(() => Harvest)
  harvest!: Harvest;

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

  @OneToMany(() => CropsPlanted, (cropsPlanted) => cropsPlanted.ruralPropertie)
  cropsPlanted = new Collection<CropsPlanted>(this);
}
