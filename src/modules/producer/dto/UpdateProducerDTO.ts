import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { IsCpfOrCnpj } from '@config/decorators/IsCpfOrCnpjValidator';

export class UpdateProducerDTO {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(18)
  @IsCpfOrCnpj({ message: 'CPF or CNPJ value is invalid!' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CPF or CNPJ are incorrect format!',
  })
  @IsOptional()
  cpfOrCnpj?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  ruralPropertieName?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  city?: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsOptional()
  state?: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsOptional()
  totalAreaFarm?: number;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsOptional()
  arableArea?: number;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsOptional()
  vegetationArea?: number;

  @ApiProperty({ type: 'string' })
  @IsUUID()
  @IsOptional()
  harvestUuid?: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  @IsOptional()
  crops?: Array<string>;
}
