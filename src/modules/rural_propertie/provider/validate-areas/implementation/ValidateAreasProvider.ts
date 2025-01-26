import { Injectable } from '@nestjs/common';

import { IValidateAreasProvider } from '../IValidateAreasProvider';

@Injectable()
export class ValidateAreasProvider implements IValidateAreasProvider {
  public validateAreas(
    totalAreaFarm: number,
    arableArea: number,
    vegetationArea: number,
  ): boolean {
    return arableArea + vegetationArea > totalAreaFarm;
  }
}
