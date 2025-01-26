export interface IValidateAreasProvider {
  validateAreas(
    totalAreaFarm: number,
    arableArea: number,
    vegetationArea: number,
  ): boolean;
}
