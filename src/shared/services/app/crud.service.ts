import { BasePagingEnum } from '@/constants/pagination.constant';
import { BaseEntity } from '@/shared/models/base.entity';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';

export interface IBaseService<T> {
  getAll(): Promise<T[]>;
  get(options: FindOneOptions<T>): Promise<T>;
  update(entity: T): Promise<T>;
  create(entity: T): Promise<string>;
  delete(id: string): Promise<any>;
  checkExists(options: FindOneOptions<T>): Promise<T>;
}

export class CRUDService<T extends BaseEntity> implements IBaseService<T> {
  constructor(private readonly genericRepository: Repository<T>) {}

  create(entity: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.genericRepository
        .save(entity)
        .then((created) => resolve(created))
        .catch((err) => reject(err));
    });
  }

  async getAll(): Promise<T[]> {
    try {
      const result = await this.genericRepository.find();

      return result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async get(options: FindOneOptions<T>): Promise<T> {
    try {
      const result = await this.genericRepository.findOne(options);

      return result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  // async getListPaginate(filter: any,options: FindManyOptions): Promise<any> {
  //   const page =

  //   return '';
  // }

  // async getListAndPaginate(
  //   filter: ListRecordsQuery,
  //   options: FindManyOptions,
  //   field?: string,
  // ): Promise<any> {
  //   const page = +filter?.page || BasePagingEnum.PAGE;
  //   const pageSize = +filter?.pageSize || BasePagingEnum.PAGE_SIZE;
  //   const skip = (page - 1) * pageSize;

  //   const conditions: FindManyOptions = {
  //     order: { createdAt: 'DESC' },
  //     ...options,
  //   };

  //   if (filter?.sortBy && filter?.sortOrder) {
  //     conditions[`order`] = { [`${filter?.sortBy}`]: `${filter?.sortOrder}` };
  //   }

  //   if (filter?.searchText && field) {
  //     conditions[`where`] = { [`${field}`]: ILike(`%${filter.searchText}%`) };
  //   }

  //   if (!filter?.getAll) {
  //     conditions[`take`] = pageSize;
  //     conditions[`skip`] = skip;
  //   }

  //   const [data, total] = await this.genericRepository.findAndCount(conditions);

  //   return BuildPagination({ page, pageSize }, data, total);
  // }

  async checkExists(options: FindOneOptions<T>): Promise<T> {
    const result = await this.genericRepository.findOne(options);

    if (result) return result;

    throw new NotFoundException(`${this.getName()} not found.`);
  }

  async delete(id: string | number) {
    try {
      const result = await this.genericRepository.delete(id);

      if (result?.affected) return { success: true };

      throw new BadRequestException(`${this.getName()} not delete.`);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  update(entity: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.genericRepository
        .findOne({
          where: {
            id: entity.id,
          } as FindOptionsWhere<T>,
        })
        .then((responseGet) => {
          try {
            if (responseGet == null) reject(`${this.getName()} not existing`);
            this.genericRepository
              .update(entity.id, entity)
              .then((response) => {
                if (response?.affected) resolve({ success: true });
              })
              .catch((err) => reject(err));
          } catch (e) {
            reject(e);
          }
        })
        .catch((err) => reject(err));
    });
  }

  getName(): string {
    return this.genericRepository?.metadata?.name?.replace('Entity', '');
  }
}
