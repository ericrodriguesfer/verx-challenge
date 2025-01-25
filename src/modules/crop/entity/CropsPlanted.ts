import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { Crop } from './Crop';

@Entity()
export class CropsPlanted {
  @PrimaryKey()
  @ApiProperty({ type: 'number' })
  id!: number;

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

  @ManyToOne(() => Crop, { eager: false })
  crop!: Crop;

  @ManyToOne(() => RuralPropertie, { eager: false })
  ruralPropertie!: RuralPropertie;
}
