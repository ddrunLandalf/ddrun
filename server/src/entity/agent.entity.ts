import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { Base } from './Base';

@EntityModel('agents')
export class AgentEntity extends Base {
  @Column({ type: 'char', length: 16, unique: true, comment: '代理编号' })
  agentNo: string;

  @Column({ type: 'varchar', length: 30, unique: true, comment: '代理账号' })
  agentAccount: string;

  @Column({ type: 'varchar', length: 40, nullable: true, comment: '密码' })
  agentPwd: string;

  @Column({ type: 'int', default: 1, comment: '状态' })
  status: 0 | 1;

  @Column({ type: 'varchar', length: 45, comment: '真实姓名' })
  realName: string;

  @Column({ type: 'varchar', length: 11, comment: '手机号' })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 6, nullable: true, comment: '默认密码' })
  defaultPwd: string;

  @Column({ type: 'char', length: 16, comment: '管理员编号' })
  updatedBy: string;
}
