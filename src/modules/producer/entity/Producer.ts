import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { ProducerRepository } from '../repository/implementation/ProducerRepository';

@Entity({ repository: () => ProducerRepository })
export class Producer {
  @PrimaryKey()
  @ApiProperty({ type: 'number' })
  id!: number;

  @Property({ type: 'uuid' })
  @Unique()
  @ApiProperty({ type: 'string' })
  uuid: string = uuid();

  @Property()
  @Unique()
  @ApiProperty({ type: 'string' })
  cprOrCnpj!: string;

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

  @OneToMany(() => RuralPropertie, (property) => property.producer, {
    eager: false,
  })
  ruralProperties? = new Collection<RuralPropertie>(this);

  [EntityRepositoryType]?: ProducerRepository;
}
