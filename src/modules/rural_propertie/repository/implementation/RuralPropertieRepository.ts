import { EntityRepository } from '@mikro-orm/postgresql';
import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import {
  IRuralPropertieRepository,
  PieChartData,
  TotalRuralPropertiesAndHectares,
} from '../IRuralPropertieRepository';
import { Optional } from '@shared/types/Optional';

export class RuralPropertieRepository
  extends EntityRepository<RuralPropertie>
  implements IRuralPropertieRepository
{
  async findByProducerId(id: number): Promise<Optional<RuralPropertie[]>> {
    const ruralProperties = await this.find({ producer: { id: id } });

    return Optional.create<RuralPropertie[]>(
      ruralProperties as RuralPropertie[],
    );
  }

  async findByUuid(uuid: string): Promise<Optional<RuralPropertie>> {
    const ruralPropertie = await this.findOne({ uuid });

    return Optional.create<RuralPropertie>(ruralPropertie as RuralPropertie);
  }

  async getTotalRuralPropertiesAndHectares(): Promise<
    Optional<TotalRuralPropertiesAndHectares>
  > {
    const [result] = await this.getEntityManager().execute(
      `SELECT
        COUNT(rp.uuid)::INTEGER AS totalRuralProperties,
        SUM(rp.total_area_farm)::FLOAT AS totalHectares
      FROM rural_propertie AS rp;`,
    );

    return Optional.create<TotalRuralPropertiesAndHectares>(
      result as TotalRuralPropertiesAndHectares,
    );
  }

  async getPieChartData(): Promise<Optional<PieChartData[]>> {
    const result = await this.getEntityManager().execute(`
      SELECT
        rp.state AS state,
        c.name AS crop,
        SUM(rp.arable_area)::FLOAT AS totalArableArea,
        SUM(rp.vegetation_area)::FLOAT AS totalVegetationArea
      FROM
        rural_propertie rp
      LEFT JOIN
        crops_planted cp ON rp.id = cp.rural_propertie_id
      LEFT JOIN
        crop c ON cp.crop_id = c.id
      GROUP BY
        rp.state, c.name
      ORDER BY
        rp.state ASC, c.name ASC;`);

    return Optional.create<PieChartData[]>(result as PieChartData[]);
  }
}
