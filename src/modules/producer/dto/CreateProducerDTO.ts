import { IsCpfOrCnpj } from '@config/decorators/IsCpfOrCnpjValidator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProducerDTO {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(18)
  @IsNotEmpty()
  @IsCpfOrCnpj({ message: 'CPF or CNPJ value is invalid!' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CPF or CNPJ are incorrect format!',
  })
  cpfOrCnpj: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  ruralPropertieName: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  city: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  state: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  totalAreaFarm: number;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  arableArea: number;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  @IsNotEmpty()
  vegetationArea: number;

  @ApiProperty({ type: 'string' })
  @IsUUID()
  @IsNotEmpty()
  harvestUuid: string;

  @ApiProperty({ type: 'string', isArray: true })
  @IsArray()
  @IsNotEmpty()
  crops: Array<string>;
}
