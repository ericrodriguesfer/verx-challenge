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
  @ApiProperty({ type: 'number' })
  @PrimaryKey()
  id?: number;

  @Unique()
  @ApiProperty({ type: 'string' })
  @Property({ type: 'uuid', onCreate: () => uuid() })
  uuid: string = uuid();

  @Property()
  @Unique()
  @ApiProperty({ type: 'string' })
  cprOrCnpj!: string;

  @ApiProperty({ type: 'string' })
  @Property({ type: 'string' })
  name!: string;

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

  @OneToMany(() => RuralPropertie, (property) => property.producer, {
    eager: false,
  })
  ruralProperties? = new Collection<RuralPropertie>(this);

  [EntityRepositoryType]?: ProducerRepository;
}
