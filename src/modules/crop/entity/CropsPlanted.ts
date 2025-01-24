import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';

import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { Crop } from './Crop';

@Entity()
export class CropsPlanted {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => RuralPropertie)
  ruralPropertie!: RuralPropertie;

  @ManyToOne(() => Crop)
  crop!: Crop;

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
}
