import {
  Entity,
  PrimaryKey,
  ManyToOne,
  Property,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { Crop } from './Crop';
import { CropsPlantedRepository } from '../repository/implementation/CropsPlantedRepository';

@Entity({ repository: () => CropsPlantedRepository })
export class CropsPlanted {
  @ApiProperty({ type: 'number' })
  @PrimaryKey()
  id?: number;

  @ApiProperty({ type: 'string' })
  @Property({
    type: 'timestamp',
    onCreate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  createdAt?: Date = new Date();

  @ApiProperty({ type: 'string' })
  @Property({
    type: 'timestamp',
    onUpdate: () => new Date(),
    defaultRaw: 'CURRENT_TIMESTAMP',
  })
  updatedAt?: Date = new Date();

  @ApiProperty({ type: 'string' })
  @Property({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Crop, { eager: false })
  crop!: Crop;

  @ManyToOne(() => RuralPropertie, { eager: false })
  ruralPropertie!: RuralPropertie;

  [EntityRepositoryType]?: CropsPlantedRepository;
}
