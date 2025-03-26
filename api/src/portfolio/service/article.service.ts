import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entity/article.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
  ) {}

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

  async getArticleById(id: string): Promise<ArticleEntity | undefined> {
    return await this.articleRepository.findOneBy({ id });
  }

  async getArticles(): Promise<ArticleEntity[]> {
    return await this.articleRepository.find();
  }

  async deleteArticle(id: string): Promise<void> {
    await this.articleRepository.delete(id);
  }
}
