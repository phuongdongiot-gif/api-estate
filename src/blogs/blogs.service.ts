import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from '../database/entities/blog.entity';
import { Blog } from './models/blog.model';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogRepo: Repository<BlogEntity>,
  ) {}

  async findAll(): Promise<Blog[]> {
    return await this.blogRepo.find({
      order: { date: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    return await this.blogRepo.findOneBy({ slug });
  }

  async upsertBlog(blogData: Partial<BlogEntity>): Promise<any> {
    try {
      await this.blogRepo.upsert(blogData, ['id']);
      return blogData;
    } catch (error: any) {
      this.logger.error('Error upserting blog:', error.message);
      throw new Error(error.message);
    }
  }

  async deleteById(id: string): Promise<any> {
    try {
      const result = await this.blogRepo.delete(id);
      return result;
    } catch (error: any) {
      this.logger.error('Error deleting blog:', error.message);
      throw new Error(error.message);
    }
  }
}
