import { Optional } from '@shared/types/Optional';

export interface ICropsPlantedRepository {
  deleteCropsPlantedByRuralPropertieUuid(
    uuid: string,
  ): Promise<Optional<boolean>>;
}
