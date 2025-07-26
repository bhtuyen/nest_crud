<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Repository Pattern

Repository Pattern để chuyển đổi dễ dàng giữa các loại database trong ứng dụng NestJS.

## Cấu trúc

Thiết kế này sử dụng một kiến trúc tách biệt giữa các lớp:

- `IBaseRepository`: Interface định nghĩa các hành vi CRUD cơ bản
- `AbstractRepository`: Lớp trừu tượng triển khai IBaseRepository
- Các implementation cụ thể:
  - `PrismaBaseRepository`: Dành cho Prisma ORM
  - `MongoBaseRepository`: Dành cho MongoDB
  - (Có thể mở rộng cho TypeORM, Sequelize, v.v.)
- `RepositoryFactory`: Factory để chọn loại repository tùy theo cấu hình

## Cách sử dụng

### 1. Cài đặt

Bảo đảm cài đặt các dependency cần thiết:

```bash
npm install @nestjs/config @prisma/client mongoose
```

### 2. Cấu hình

Thêm cấu hình trong `.env`:

```
DATABASE_TYPE=prisma  # Có thể là: prisma, mongo, typeorm
```

### 3. Tạo Repository cụ thể

```typescript
// Ví dụ với Prisma
@Injectable()
export class PrismaPostRepository extends PrismaBaseRepository<Post, Prisma.PostCreateInput, Prisma.PostUpdateInput, Prisma.PostWhereInput> {
  readonly model = 'post' as keyof PrismaService;

  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

// Ví dụ với MongoDB
@Injectable()
export class MongoPostRepository extends MongoBaseRepository<Post, PostDocument, CreatePostDto, UpdatePostDto> {
  constructor(@InjectModel(Post.name) postModel: Model<PostDocument>) {
    super(postModel);
  }

  protected mapToEntity(document: PostDocument): Post {
    const { _id, ...rest } = document.toObject();
    return { id: _id.toString(), ...rest } as Post;
  }
}
```

### 4. Sử dụng trong service

```typescript
@Injectable()
export class PostService {
  private postRepo: IBaseRepository<Post, CreatePostDto, UpdatePostDto>;

  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    private readonly prismaPostRepo: PrismaPostRepository,
    private readonly mongoPostRepo: MongoPostRepository
  ) {
    // Lấy repository dựa trên cấu hình
    this.postRepo = this.repositoryFactory.getRepository(prismaPostRepo, mongoPostRepo);
  }

  async findAll() {
    return this.postRepo.findAll();
  }

  // ...các phương thức khác
}
```

### 5. Chuyển đổi giữa các loại database

Chỉ cần thay đổi biến môi trường `DATABASE_TYPE` và restart ứng dụng.

## Lợi ích

- **Decoupling**: Tách biệt business logic khỏi data access
- **Testability**: Dễ dàng mock repository để test
- **Flexibility**: Chuyển đổi database mà không cần thay đổi code
- **Maintainability**: Code dễ bảo trì và mở rộng hơn
