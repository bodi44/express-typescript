import 'reflect-metadata';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';
import { RequestHandler } from 'express';

interface RouteHandlerDescriptor extends PropertyDescriptor{
  value?: RequestHandler
}

const routerBinder = (method: string) => {
  return (path: string) => {
    return (target: any, key: string, desc: RouteHandlerDescriptor) => {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
};

export const get = routerBinder(Methods.get);
export const put = routerBinder(Methods.put);
export const post = routerBinder(Methods.post);
export const del = routerBinder(Methods.del);
export const patch = routerBinder(Methods.patch);
