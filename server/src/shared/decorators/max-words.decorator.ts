import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/** Valida que un string no supere `max` palabras. */
export function MaxWords(max: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'maxWords',
      target: object.constructor,
      propertyName,
      constraints: [max],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const [maxWords] = args.constraints as [number];
          const words = value.trim().split(/\s+/).filter(Boolean);
          return words.length <= maxWords;
        },
        defaultMessage(args: ValidationArguments) {
          const [maxWords] = args.constraints as [number];
          return `El valor no debe contener más de ${maxWords} palabras`;
        },
      },
    });
  };
}
