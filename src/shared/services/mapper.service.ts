import { Injectable, Scope } from '@nestjs/common';
import { plainToClass, ClassConstructor } from 'class-transformer';

@Injectable({ scope: Scope.DEFAULT })
export class MapperService {
  /**
   * Generic mapper từ Prisma sang Entity
   * @param entityClass - Lớp Entity
   * @param prismaObject - Đối tượng Prisma
   * @param mappingConfig - Cấu hình mapping
   * @returns Đối tượng Entity
   */
  public fromPrisma<T, P>(entityClass: ClassConstructor<T>, prismaObject: P, mappingConfig?: Record<string, string>): T {
    const mapped = {} as any;

    if (mappingConfig) {
      Object.keys(mappingConfig).forEach((entityKey) => {
        const prismaKey = mappingConfig[entityKey];
        mapped[entityKey] = prismaObject[prismaKey];
      });
    }

    return plainToClass(entityClass, mapped);
  }
}
