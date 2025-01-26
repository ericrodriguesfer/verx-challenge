/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { IsUUID } from 'class-validator';

@Injectable()
export class UUIDQueryParamsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value?.ruralPropertieUuid && !IsUUID(value.ruralPropertieUuid)) {
      throw new BadRequestException('RuralPropertie UUID must be a valid UUID');
    }

    return value;
  }
}
