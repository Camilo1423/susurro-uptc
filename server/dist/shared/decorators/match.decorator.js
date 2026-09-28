import { registerDecorator, } from 'class-validator';
export function Match(property, validationOptions) {
    return (object, propertyName) => {
        registerDecorator({
            name: 'Match',
            target: object.constructor,
            propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value, args) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = args.object[relatedPropertyName];
                    return value === relatedValue;
                },
                defaultMessage(args) {
                    return `${args.property} no coincide con ${args.constraints[0]}`;
                },
            },
        });
    };
}
//# sourceMappingURL=match.decorator.js.map