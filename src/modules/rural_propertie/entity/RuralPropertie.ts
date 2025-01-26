import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';
import { Harvest } from '@modules/harvest/entity/Harvest';
import { Producer } from '@modules/producer/entity/Producer';
import { RuralPropertieRepository } from '../repository/implementation/RuralPropertieRepository';

@Entity({ repository: () => RuralPropertieRepository })
export class RuralPropertie {
  @ApiProperty({ type: 'number' })
  @PrimaryKey()
  id?: number;

  @ApiProperty({ type: 'string' })
  @Property({ type: 'uuid', onCreate: () => uuid() })
  @Unique()
  uuid: string = uuid();

  @ApiProperty({ type: 'string' })
  @Property()
  name!: string;

  @ApiProperty({ type: 'string' })
  @Property()
  city!: string;

  @ApiProperty({ type: 'string' })
  @Property()
  state!: string;

  @ApiProperty({ type: 'number' })
  @Property({ type: 'decimal', precision: 20, scale: 2 })
  totalAreaFarm!: number;

  @ApiProperty({ type: 'number' })
  @Property({ type: 'decimal', precision: 20, scale: 2 })
  arableArea!: number;

  @ApiProperty({ type: 'number' })
  @Property({ type: 'decimal', precision: 20, scale: 2 })
  vegetationArea!: number;

  @ApiProperty({ type: 'string' })
  @Property({
    type: 'timestamp',
    onCreate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date = new Date();

  @Property({
    type: 'timestamp',
    onUpdate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty({ type: 'string' })
  updatedAt?: Date = new Date();

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

  [EntityRepositoryType]?: RuralPropertieRepository;
}
