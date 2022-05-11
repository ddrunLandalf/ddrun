import { Controller, Get, Inject, Query } from '@midwayjs/decorator';
import { Validate } from '@midwayjs/validate';
import { CityListDTO } from '../../dto/city.dto';
import { BaseController } from '../base.controller';
import { CitysService } from '../../service/citys.service';

@Controller('/api/city')
export class AppCityController extends BaseController {
  @Inject()
  cityService: CitysService;

  @Get('/list')
  @Validate()
  async list(@Query() listDto: CityListDTO) {
    return this.responseSuccess('ok', await this.cityService.list(listDto));
  }
}
