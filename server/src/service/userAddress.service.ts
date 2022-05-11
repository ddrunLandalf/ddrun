import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { UserAddressAddDTO } from '../dto/user.dto';
import { UserAddressEntity } from '../entity/userAddress.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';

@Provide()
export class UserAddressService extends BaseService {
  @InjectEntityModel(UserAddressEntity)
  userAddressEntity: Repository<UserAddressEntity>;

  async add(addDTO: UserAddressAddDTO) {
    if (!addDTO.addressNo) {
      const no = this.nanoid(16);
      const result = await this.userAddressEntity.insert(
        Object.assign(addDTO, {
          addressNo: no,
          userNo: this.ctx.userInfo.userNo,
        })
      );
      if (!result.raw.insertId) {
        throw new DefaultError('添加地址失败');
      }
      return no;
    } else {
      const result = await this.userAddressEntity.update(
        {
          addressNo: addDTO.addressNo,
        },
        addDTO
      );
      if (result.affected === 0) {
        throw new DefaultError('更新地址失败');
      }
      return addDTO.addressNo;
    }
  }
}
