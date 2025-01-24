import { Controller, Get } from '@nestjs/common';
import { Crop } from '../entity/Crop';
import { ApplicationError } from '@shared/types/ApplicationError';
import { ListAllCropsUseCase } from '../use-case/implementation/ListAllCropsUseCase';

@Controller('crop')
export class CropController {
  constructor(private readonly listAllCropsUseCase: ListAllCropsUseCase) {}

  @Get('')
  async listAllCrops(): Promise<Crop[] | ApplicationError> {
    const result = await this.listAllCropsUseCase.execute();

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }
}
