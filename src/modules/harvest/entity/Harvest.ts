import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { HarvestRepository } from '../repository/implementation/HarvestRepository';

@Entity({ repository: () => HarvestRepository })
export class Harvest {
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

  @OneToMany(() => RuralPropertie, (ruralPropertie) => ruralPropertie.harvest, {
    eager: false,
  })
  ruralProperties = new Collection<RuralPropertie>(this);

  [EntityRepositoryType]?: HarvestRepository;
}
