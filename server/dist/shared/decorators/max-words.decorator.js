import { registerDecorator, } from 'class-validator';
export function MaxWords(max, validationOptions) {
    return function (object, propertyName) {
        registerDecorator({
            name: 'maxWords',
            target: object.constructor,
            propertyName,
            constraints: [max],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    if (typeof value !== 'string')
                        return false;
                    const [maxWords] = args.constraints;
                    const words = value.trim().split(/\s+/).filter(Boolean);
                    return words.length <= maxWords;
                },
                defaultMessage(args) {
                    const [maxWords] = args.constraints;
                    return `El valor no debe contener más de ${maxWords} palabras`;
                },
            },
        });
    };
}
//# sourceMappingURL=max-words.decorator.js.map