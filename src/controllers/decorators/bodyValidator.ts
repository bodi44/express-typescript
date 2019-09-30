import 'reflect-metadata';
import { MetadataKeys } from './MetadataKeys';

export const bodyValidator = (...keys: string[]) => {
  return (target: any, key: string, desc: PropertyDescriptor) => {
    Reflect.defineMetadata(MetadataKeys.validator, keys, target, key);
  };
};
