import {
  Column,
  CreateDateColumn,
  EntitySubscriberInterface,
  InsertEvent,
  PrimaryGeneratedColumn,
  RemoveEvent,
  UpdateDateColumn,
  UpdateEvent,
} from 'typeorm';

export class EverythingSubscriber implements EntitySubscriberInterface {
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<any>) {
    console.log('BEFORE ENTITY INSERTED:', event.entity);
  }

  /**
   * Called before entity insertion.
   */
  beforeUpdate(event: UpdateEvent<any>) {
    console.log('BEFORE ENTITY UPDATED:', event.entity);
  }

  /**
   * Called before entity insertion.
   */
  beforeRemove(event: RemoveEvent<any>) {
    console.log(
      `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
      event.entity
    );
  }

  /**
   * Called after entity insertion.
   */
  afterInsert(event: InsertEvent<any>) {
    console.log('AFTER ENTITY INSERTED:', event.entity);
  }

  /**
   * Called after entity insertion.
   */
  afterUpdate(event: UpdateEvent<any>) {
    console.log('AFTER ENTITY UPDATED:', event.entity);
  }

  /**
   * Called after entity insertion.
   */
  afterRemove(event: RemoveEvent<any>) {
    console.log(
      `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
      event.entity
    );
  }

  /**
   * Called after entity is loaded.
   */
  afterLoad(entity: any) {
    console.log('AFTER ENTITY LOADED:', entity);
  }
}

export class Base extends EverythingSubscriber {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}

export class CommonBase extends Base {
  @Column({ type: 'boolean', default: false, comment: '软删除' })
  isDelete: boolean;
}

export class EnterpriseBase extends Base {
  @Column({
    name: 'enterprise_no',
    type: 'varchar',
    length: 13,
    comment: '企业编号',
  })
  enterpriseNo: string;

  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 13,
    comment: '操作用户编号',
  })
  updatedBy: string;
}

export class OpBase extends Base {
  @Column({
    name: 'updated_by',
    type: 'varchar',
    length: 13,
    comment: '操作用户编号',
  })
  updatedBy: string;
}
