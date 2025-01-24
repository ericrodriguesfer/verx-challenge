import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';

import { CropsPlanted } from './CropsPlanted';
import { CropRepository } from '../repository/implementation/CropRepository';

@Entity({ repository: () => CropRepository })
export class Crop {
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

  @OneToMany(() => CropsPlanted, (cropsPlanted) => cropsPlanted.crop)
  cropsPlanted = new Collection<CropsPlanted>(this);

  [EntityRepositoryType]?: CropRepository;
}
