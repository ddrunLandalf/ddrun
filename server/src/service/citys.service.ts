import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { CityListDTO } from '../dto/city.dto';
import { CitysEntity } from '../entity/citys.entity';
import { CitysTagGroupEntity } from '../entity/citysTagGroup.entity';
import { CitysWeightTagEntity } from '../entity/citysWeightTag.entity';
import { BaseService } from './base.service';
import { QueryService } from './query.service';

@Provide()
export class CitysService extends BaseService {
  @InjectEntityModel(CitysEntity)
  citysEntity: Repository<CitysEntity>;

  @InjectEntityModel(CitysTagGroupEntity)
  tagEntity: Repository<CitysTagGroupEntity>;

  @InjectEntityModel(CitysWeightTagEntity)
  weightEntity: Repository<CitysWeightTagEntity>;

  @Inject()
  queryService: QueryService;

  async list(listDTO: CityListDTO) {
    let wheres = '';
    if (listDTO.cityName)
      wheres += ` ${wheres ? 'and' : ''} cityName like "%${listDTO.cityName}%"`;

    if (listDTO.province) {
      wheres += ` ${wheres ? 'and' : ''} province like "%${listDTO.province}%"`;
    }

    if (listDTO.status !== undefined) {
      wheres += `  ${wheres ? 'and' : ''} status = ${listDTO.status}`;
    }

    return await this.queryService.select(this.citysEntity, {
      tables: 'citys',
      wheres,
      current: listDTO.current,
      pageSize: listDTO.pageSize,
    });
  }

  async findByNo(no: string) {
    return await this.citysEntity.findOne({ where: { cityNo: no } });
  }

  async findByCity(province: string, key: string) {
    return await this.citysEntity.findOne({
      where: { province, cityName: key },
    });
  }

  async findByOnlyCity(city: string) {
    return await this.citysEntity.findOne({
      where: { cityName: city },
    });
  }

  async tagFindById(id: number) {
    return await this.tagEntity.findOne({ where: { id } });
  }

  async weightFindById(id: number) {
    return await this.weightEntity.findOne({ where: { id } });
  }
}
