import { Optional } from '@shared/types/Optional';
import { RuralPropertie } from '../entity/RuralPropertie';

export interface TotalRuralPropertiesAndHectares {
  totalRuralProperties: number;
  totalHectares: number;
}

export interface PieChartData {
  state: string;
  crop: string;
  totalArableArea: number;
  totalVegetationArea: number;
}

export interface IRuralPropertieRepository {
  findByProducerId(id: number): Promise<Optional<RuralPropertie[]>>;
  findByUuid(uuid: string): Promise<Optional<RuralPropertie>>;
  getTotalRuralPropertiesAndHectares(): Promise<
    Optional<TotalRuralPropertiesAndHectares>
  >;
  getPieChartData(): Promise<Optional<PieChartData>>;
}
