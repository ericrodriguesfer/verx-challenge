import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ async: false })
export class IsCpfOrCnpjValidator implements ValidatorConstraintInterface {
  public validate(value: string): boolean {
    if (!value) return false;
    const valueSanitized = value.replace(/[.\-/]/g, '');
    return cpf.isValid(valueSanitized) || cnpj.isValid(valueSanitized);
  }

  public defaultMessage(): string {
    return `The value ($value) is not a valid CPF or CNPJ!`;
  }
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCpfOrCnpjValidator,
    });
  };
}
