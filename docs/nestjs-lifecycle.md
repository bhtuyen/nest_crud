# NestJS Lifecycle Events - Tổng quan về Vòng đời Ứng dụng

## Mục lục

1. [Giới thiệu](#giới-thiệu)
2. [Các giai đoạn của Lifecycle](#các-giai-đoạn-của-lifecycle)
3. [Chi tiết các Lifecycle Hooks](#chi-tiết-các-lifecycle-hooks)
4. [Thứ tự thực thi](#thứ-tự-thực-thi)
5. [Ví dụ thực tế](#ví-dụ-thực-tế)
6. [Best Practices](#best-practices)

## Giới thiệu

NestJS Lifecycle Events là một tập hợp các hook (móc) cho phép developers tương tác với ứng dụng tại các giai đoạn quan trọng - từ khởi tạo, vận hành đến khi kết thúc. Hiểu rõ lifecycle giúp bạn xây dựng ứng dụng mạnh mẽ, hiệu quả và bảo mật hơn.

## Các giai đoạn của Lifecycle

NestJS chia lifecycle thành 3 giai đoạn chính:

### 1. **Initialization Phase (Giai đoạn Khởi tạo)**

- Bootstrap ứng dụng NestJS
- Khởi tạo tất cả modules
- Trigger các lifecycle hooks liên quan đến khởi tạo

### 2. **Running Phase (Giai đoạn Vận hành)**

- Ứng dụng bắt đầu lắng nghe requests
- Xử lý các request/response
- Thực hiện business logic

### 3. **Termination Phase (Giai đoạn Kết thúc)**

- Nhận signal kết thúc (SIGTERM, SIGINT)
- Cleanup resources
- Đóng kết nối database, file handles
- Kết thúc process

## Chi tiết các Lifecycle Hooks

### 1. `OnModuleInit`

**Thời điểm:** Được gọi một lần sau khi NestJS đã khởi tạo module và giải quyết dependencies.

**Mục đích:** Thiết lập cấu hình hoặc dữ liệu ban đầu cần thiết cho module.

**Interface:** `OnModuleInit`

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const dbHost = this.configService.get('DATABASE_HOST');
    console.log(`Đang kết nối tới database tại ${dbHost}`);
    // Thiết lập kết nối database
  }
}
```

**Ví dụ trong dự án:**

```typescript
// src/shared/services/prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect(); // Kết nối tới database khi module được khởi tạo
  }
}
```

### 2. `OnApplicationBootstrap`

**Thời điểm:** Được thực thi sau khi tất cả modules đã được khởi tạo và ngay trước khi ứng dụng bắt đầu lắng nghe connections.

**Mục đích:** Thực hiện các tác vụ cuối cùng trước khi server sẵn sàng phục vụ requests.

**Interface:** `OnApplicationBootstrap`

```typescript
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class SchedulerService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('Khởi động scheduled jobs...');
    this.startJobs();
    // Thiết lập cron jobs, scheduled tasks
  }

  private startJobs() {
    // Logic để khởi động các scheduled jobs
  }
}
```

### 3. `OnModuleDestroy`

**Thời điểm:** Được kích hoạt khi ứng dụng sắp tắt.

**Mục đích:** Giải phóng resources mà module đang giữ để tránh memory leaks.

**Interface:** `OnModuleDestroy`

```typescript
import { Injectable, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class ResourceService implements OnModuleDestroy {
  onModuleDestroy() {
    console.log('Đang giải phóng resources...');
    this.releaseAllResources();
  }

  private releaseAllResources() {
    // Logic để giải phóng resources một cách an toàn
  }
}
```

### 4. `BeforeApplicationShutdown`

**Thời điểm:** Được gọi trước khi ứng dụng hoàn toàn tắt.

**Mục đích:** Cơ hội cuối cùng để thực hiện các tác vụ bất đồng bộ.

**Interface:** `BeforeApplicationShutdown`

```typescript
import { Injectable, BeforeApplicationShutdown } from '@nestjs/common';

@Injectable()
export class ShutdownService implements BeforeApplicationShutdown {
  beforeApplicationShutdown(signal: string) {
    console.log(`Nhận signal ${signal}, đang thực hiện pre-shutdown tasks.`);
    // Lưu logs cuối cùng, thông báo hệ thống bên ngoài
  }
}
```

### 5. `OnApplicationShutdown`

**Thời điểm:** Được gọi ngay trước khi application process thoát.

**Mục đích:** Cleanup cuối cùng và logging.

**Interface:** `OnApplicationShutdown`

```typescript
import { Injectable, OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class FinalCleanupService implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.log(`Ứng dụng đang tắt do ${signal}.`);
    // Cleanup cuối cùng
  }
}
```

## Thứ tự thực thi

### Trong quá trình khởi tạo:

1. `constructor` - Khởi tạo class
2. `onModuleInit` - Khởi tạo module
3. `onApplicationBootstrap` - Bootstrap ứng dụng
4. Ứng dụng bắt đầu lắng nghe

### Trong quá trình tắt:

1. Nhận termination signal
2. `beforeApplicationShutdown` - Pre-shutdown tasks
3. `onModuleDestroy` - Destroy modules
4. `onApplicationShutdown` - Final cleanup
5. Process exits

## Ví dụ thực tế

### Ví dụ 1: Database Service với Lifecycle Management

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createConnection, Connection } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;

  async onModuleInit() {
    console.log('Đang khởi tạo kết nối database...');
    this.connection = await createConnection();
    console.log('Kết nối database thành công!');
  }

  async onModuleDestroy() {
    console.log('Đang đóng kết nối database...');
    if (this.connection) {
      await this.connection.close();
      console.log('Đã đóng kết nối database.');
    }
  }
}
```

### Ví dụ 2: Redis Cache Service

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  async onModuleInit() {
    console.log('Đang kết nối Redis...');
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
    });

    this.redisClient.on('connect', () => {
      console.log('Kết nối Redis thành công!');
    });
  }

  async onModuleDestroy() {
    console.log('Đang ngắt kết nối Redis...');
    if (this.redisClient) {
      await this.redisClient.disconnect();
      console.log('Đã ngắt kết nối Redis.');
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.setex(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
```

### Ví dụ 3: Application với đầy đủ Lifecycle Hooks

```typescript
import { Module, OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: []
})
export class AppModule implements OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown, OnApplicationShutdown {
  onModuleInit() {
    console.log('📦 AppModule đã được khởi tạo');
  }

  onApplicationBootstrap() {
    console.log('🚀 Ứng dụng đã bootstrap hoàn tất');
  }

  beforeApplicationShutdown(signal?: string) {
    console.log(`🔄 Chuẩn bị tắt ứng dụng (Signal: ${signal})`);
  }

  onApplicationShutdown(signal?: string) {
    console.log(`🛑 Ứng dụng đã tắt (Signal: ${signal})`);
  }
}
```

### Ví dụ 4: Kích hoạt Graceful Shutdown

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Kích hoạt shutdown hooks
  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🎯 Ứng dụng đang chạy trên port ${port}`);
}

bootstrap().catch((err) => {
  console.error('❌ Lỗi khởi động ứng dụng:', err);
  process.exit(1);
});
```

## Best Practices

### 1. **Quản lý Resources hiệu quả**

```typescript
@Injectable()
export class FileService implements OnModuleInit, OnModuleDestroy {
  private fileHandles: fs.FileHandle[] = [];

  async onModuleInit() {
    // Mở file handles
  }

  async onModuleDestroy() {
    // Đóng tất cả file handles
    for (const handle of this.fileHandles) {
      await handle.close();
    }
  }
}
```

### 2. **Error Handling trong Lifecycle**

```typescript
@Injectable()
export class RobustService implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.initializeExternalService();
    } catch (error) {
      console.error('Lỗi khởi tạo service:', error);
      // Có thể throw error để ngăn ứng dụng khởi động
      // hoặc set fallback state
    }
  }
}
```

### 3. **Logging và Monitoring**

```typescript
@Injectable()
export class MonitoringService implements OnApplicationBootstrap, OnApplicationShutdown {
  onApplicationBootstrap() {
    console.log(`[${new Date().toISOString()}] Ứng dụng đã sẵn sàng`);
    // Gửi metric tới monitoring service
  }

  onApplicationShutdown(signal: string) {
    console.log(`[${new Date().toISOString()}] Ứng dụng tắt (${signal})`);
    // Gửi shutdown metric
  }
}
```

### 4. **Timeout cho Cleanup**

```typescript
@Injectable()
export class TimeoutService implements OnModuleDestroy {
  async onModuleDestroy() {
    const timeout = 5000; // 5 seconds

    const cleanup = new Promise(async (resolve) => {
      await this.performCleanup();
      resolve(void 0);
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Cleanup timeout')), timeout);
    });

    try {
      await Promise.race([cleanup, timeoutPromise]);
    } catch (error) {
      console.warn('Cleanup timeout, forcing shutdown');
    }
  }
}
```

### 5. **Sử dụng trong Module**

```typescript
@Module({
  providers: [
    DatabaseService,
    CacheService
    // Các services khác
  ]
})
export class SharedModule implements OnModuleInit {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService
  ) {}

  async onModuleInit() {
    console.log('SharedModule initialization completed');
    // Module-level initialization logic
  }
}
```

## Lưu ý quan trọng

1. **Performance**: Tránh logic phức tạp trong lifecycle hooks vì chúng có thể làm chậm quá trình khởi động/tắt
2. **Dependencies**: Đảm bảo dependencies đã sẵn sàng trước khi sử dụng trong lifecycle hooks
3. **Error Handling**: Luôn handle errors trong lifecycle hooks để tránh crash ứng dụng
4. **Async Operations**: Sử dụng `async/await` cho các operations bất đồng bộ
5. **Testing**: Viết unit tests cho logic trong lifecycle hooks

## Kết luận

NestJS Lifecycle Events cung cấp cơ chế mạnh mẽ để quản lý vòng đời ứng dụng. Hiểu rõ và sử dụng đúng các hooks này giúp bạn:

- Xây dựng ứng dụng robust và reliable
- Quản lý resources hiệu quả
- Tránh memory leaks và resource leaks
- Đảm bảo graceful shutdown
- Cải thiện user experience

Hãy luôn nhớ rằng lifecycle management là một phần quan trọng trong việc xây dựng ứng dụng production-ready!

---

**Tài liệu tham khảo:**

- [NestJS Official Documentation - Lifecycle Events](https://docs.nestjs.com/fundamentals/lifecycle-events)
- [NestJS Application Context](https://docs.nestjs.com/fundamentals/application-context)
