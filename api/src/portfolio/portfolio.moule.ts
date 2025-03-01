import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './infra/persistence/entity/profile.entity';
import { MemberEntity } from 'src/auth/member/member.entity';
import { ArticleEntity } from './infra/persistence/entity/article.entity';
import { ProjectEntity } from './infra/persistence/entity/project.entity';
import { UserInterfaceEntity } from './infra/persistence/entity/user-interface.entity';
import { AuthService } from 'src/auth/service/auth.service';

@Module({
  controllers: [],
  providers: [AuthService],
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 20000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forFeature([
      ProfileEntity,
      MemberEntity,
      ArticleEntity,
      ProjectEntity,
      UserInterfaceEntity,
    ]),
  ],
})
export class PortfolioModule {}
