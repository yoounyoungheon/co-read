import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { MemberEntity } from 'src/auth/member/member.entity';
import { ArticleEntity } from './entity/article.entity';
import { ProjectEntity } from './entity/project.entity';
import { UserInterfaceEntity } from './entity/user-interface.entity';
import { AuthService } from 'src/auth/service/auth.service';
import { ProfileController } from './controller/\bprofile.controller';
import { ProfileService } from './service/profile.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { ArticleService } from './service/article.service';
import { ArticleController } from './controller/article.controller';

@Module({
  controllers: [ProfileController, ArticleController],
  providers: [AuthService, ProfileService, JwtService, ArticleService],
  imports: [
    AuthModule,
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
