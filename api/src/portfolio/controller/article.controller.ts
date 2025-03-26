import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ArticleService } from '../service/article.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateArticleDto } from '../dto/create-article.dto';
import { ArticleEntity } from '../entity/article.entity';
import { MemberEntity } from 'src/auth/member/member.entity';
import { Member } from 'src/utils/decorater/get-member.decorator';

@ApiTags('Article Controller')
@Controller('/article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiOperation({ summary: '기사를 생성합니다.' })
  @Post()
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Member() member: MemberEntity,
  ): Promise<ArticleEntity> {
    return this.articleService.createArticle(member.memberId, createArticleDto);
  }

  @ApiOperation({ summary: 'ID로 기사를 가져옵니다.' })
  @Get(':id')
  async getArticleById(@Param('id') id: string): Promise<ArticleEntity> {
    return this.articleService.getArticleById(id);
  }

  @ApiOperation({ summary: '모든 기사를 가져옵니다.' })
  @Post('/all')
  async getArticles(): Promise<ArticleEntity[]> {
    return this.articleService.getArticles();
  }

  @ApiOperation({ summary: 'ID로 기사를 삭제합니다.' })
  @Delete(':id')
  async deleteArticle(@Param('id') id: string): Promise<void> {
    return this.articleService.deleteArticle(id);
  }
}
