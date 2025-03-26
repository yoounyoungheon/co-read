import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entity/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}

  @Transactional()
  async createArticle(
    userId: string,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const { title, description, url } = createArticleDto;
    const newArticle = this.articleRepository.create({
      userId,
      title,
      description,
      url,
    });
    return await this.articleRepository.save(newArticle);
  }

  @Transactional()
  async getArticleById(id: string): Promise<ArticleEntity | undefined> {
    return await this.articleRepository.findOneBy({ id });
  }

  @Transactional()
  async getArticles(): Promise<ArticleEntity[]> {
    return await this.articleRepository.find();
  }

  @Transactional()
  async deleteArticle(id: string): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
