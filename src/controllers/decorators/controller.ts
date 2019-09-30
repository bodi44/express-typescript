import 'reflect-metadata';
import { AppRouter } from '../../AppRouter';
import { Methods } from './Methods';
import { MetadataKeys } from './MetadataKeys';
import { RequestHandler, Response, Request, NextFunction } from 'express';

const bodyValidators = (keys: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      res.status(422).send('Invalid request');
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        res.status(402).send(`Missing property ${key}`);
        return;
      }
    }

    next();
  };
};

export const controller = (routePrefix: string) => {
  return (target: Function) => {
    const router = AppRouter.getInstance();

    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(
        MetadataKeys.path,
        target.prototype,
        key,
      );
      const method: Methods = Reflect.getMetadata(
        MetadataKeys.method,
        target.prototype,
        key,
      );
      const middlewares = Reflect.getMetadata(
        MetadataKeys.middleware,
        target.prototype,
        key,
      ) || [];

      const requiredBodyProps = Reflect.getMetadata(
        MetadataKeys.validator,
        target.prototype,
        key,
      ) || [];

      const validator = bodyValidators(requiredBodyProps);

      if (path) {
        router[method](
          `${routePrefix}${path}`,
          ...middlewares,
          validator,
          routeHandler,
        );
      }
    }
  };
};
