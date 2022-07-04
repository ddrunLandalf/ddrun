import { App, Configuration } from '@midwayjs/decorator';
import { ILifeCycle } from '@midwayjs/core';
import { Application } from 'egg';
import { join } from 'path';
import * as egg from '@midwayjs/web';
import * as redis from '@midwayjs/redis';
import * as validate from '@midwayjs/validate';
import { AllErrorFilter } from './filter/all.filter';
import * as orm from '@midwayjs/orm';
import * as upload from '@midwayjs/upload';
import * as staticFile from '@midwayjs/static-file';
import * as task from '@midwayjs/task';

@Configuration({
  imports: [egg, redis, validate, orm, upload, staticFile, task],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application;

  async onReady() {
    this.app.useFilter([AllErrorFilter]);
  }
}
