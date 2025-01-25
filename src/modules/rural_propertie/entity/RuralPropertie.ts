import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';
import { Harvest } from '@modules/harvest/entity/Harvest';
import { Producer } from '@modules/producer/entity/Producer';

@Entity()
export class RuralPropertie {
  @PrimaryKey()
  @ApiProperty({ type: 'number' })
  id!: number;

  @Property({ type: 'uuid' })
  @Unique()
  @ApiProperty({ type: 'string' })
  uuid: string = uuid();

  @Property()
  @ApiProperty({ type: 'string' })
  name!: string;

  @Property()
  @ApiProperty({ type: 'string' })
  city!: string;

  @Property()
  @ApiProperty({ type: 'string' })
  state!: string;

  @Property({ type: 'decimal', precision: 20, scale: 2 })
  @ApiProperty({ type: 'number' })
  totalAreaFarm!: number;

  @Property({ type: 'decimal', precision: 20, scale: 2 })
  @ApiProperty({ type: 'number' })
  arableArea!: number;

  @Property({ type: 'decimal', precision: 20, scale: 2 })
  @ApiProperty({ type: 'number' })
  vegetationArea!: number;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP' })
  @ApiProperty({ type: 'string' })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp',
    onUpdate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ type: 'string' })
  updatedAt: Date = new Date();

  @Property({ type: 'timestamp', nullable: true })
  @ApiProperty({ type: 'string' })
  deletedAt?: Date;

  @ManyToOne(() => Producer, { eager: false })
  producer?: Producer;

  @ManyToOne(() => Harvest, { eager: false })
  harvest?: Harvest;

  @OneToMany(
    () => CropsPlanted,
    (cropsPlanted) => cropsPlanted.ruralPropertie,
    { eager: false },
  )
  cropsPlanted = new Collection<CropsPlanted>(this);
}
