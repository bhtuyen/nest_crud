import { Injectable, Scope } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

/**
 * Dịch vụ băm mật khẩu
 */
@Injectable({ scope: Scope.DEFAULT })
export class HashingService {
  /**
   * Số lần lặp lại để tạo chuỗi hash
   */
  private static readonly saltRounds = 10;

  /**
   * Tạo chuỗi hash
   * @param value - Chuỗi cần tạo hash
   * @returns Chuỗi hash
   */
  hash(value: string) {
    return hash(value, HashingService.saltRounds);
  }

  compare(value: string, hash: string) {
    return compare(value, hash);
  }
}
