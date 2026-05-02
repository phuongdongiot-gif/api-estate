import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsController } from './blogs.controller';
import { BlogsResolver } from './blogs.resolver';
import { BlogsService } from './blogs.service';
import { BlogEntity } from '../database/entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsResolver],
})
export class BlogsModule {}
