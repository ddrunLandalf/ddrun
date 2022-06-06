import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { QQappEntity } from '../../entity/qq.entity';
import { BaseService } from '../base.service';

@Provide()
export class QQService extends BaseService {
  @InjectEntityModel(QQappEntity)
  qqappEntity: Repository<QQappEntity>;

  async findByOpenid(openid: string) {
    return await this.qqappEntity.findOne({ where: { openid } });
  }
}
