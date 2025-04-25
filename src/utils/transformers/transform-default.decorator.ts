import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Decorator that transforms the property value to a default value if it is undefined.
 * @param defaultValue The default value to set if the property is undefined.
 */
export function TransformDefault(defaultValue: any): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    // Check if the value is explicitly null or any other value besides undefined
    if (value !== undefined) {
      return value; // Return the original value (could be false, null, etc.)
    }
    return defaultValue; // Return the default value only if undefined
  });
}