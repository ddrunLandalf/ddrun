import { Inject, Provide } from '@midwayjs/decorator';
import { RedisService } from '@midwayjs/redis';
import { Context } from 'egg';
import { HttpService } from './http.service';
import { nanoid } from 'nanoid';
import { CustomConfig } from '../interface';
const env = process.env.NODE_ENV as 'dev' | 'local' | 'prod' | 'unittest';
const config = require(`../config/config.${env}`);

@Provide()
export class BaseService {
  @Inject()
  redis: RedisService;

  @Inject()
  ctx: Context;

  @Inject()
  http: HttpService;

  nanoid(len = 13) {
    return nanoid(len);
  }
  config(): CustomConfig {
    return config.default as CustomConfig;
  }

  filterNumber(num: number) {
    return Math.floor(Math.round(num * 100)) / 100;
  }
}
