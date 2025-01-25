import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

import { CropsPlanted } from './CropsPlanted';
import { CropRepository } from '../repository/implementation/CropRepository';

@Entity({ repository: () => CropRepository })
export class Crop {
  @PrimaryKey()
  @ApiProperty({ type: 'number' })
  id!: number;

  @Property({ type: 'uuid' })
  @ApiProperty({ type: 'string' })
  uuid: string = uuid();

  @Property()
  @ApiProperty({ type: 'string' })
  name!: string;

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

  @OneToMany(() => CropsPlanted, (cropsPlanted) => cropsPlanted.crop, {
    eager: false,
  })
  cropsPlanted = new Collection<CropsPlanted>(this);

  [EntityRepositoryType]?: CropRepository;
}
