import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('configs')
export class ConfigEntity extends Base {
  @Column({ type: 'varchar', length: 45, unique: true, comment: '关键key' })
  configKey: string;

  @Column({ type: 'json', comment: '配置内容' })
  configContext: any;

  @Column({ type: 'char', length: 16, comment: '管理员' })
  updatedBy: string;
}
