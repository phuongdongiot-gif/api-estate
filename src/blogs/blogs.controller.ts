import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('api/blogs')
export class BlogsController {
  private readonly logger = new Logger(BlogsController.name);

  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async findAll() {
    return this.blogsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const item = await this.blogsService.findBySlug(slug);
    if (!item) return { success: false, msg: 'Not found' };
    return item;
  }

  @Post()
  async create(@Body() body: any) {
    this.logger.log(`Creating blog: ${body.title}`);
    try {
      const data = await this.blogsService.upsertBlog({
        id: body.id || `blog-${Date.now()}`,
        slug: body.slug,
        title: body.title,
        date: body.date,
        description: body.description,
        img_url: body.img_url,
        content: body.content,
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    this.logger.log(`Updating blog: ${id}`);
    try {
      const data = await this.blogsService.upsertBlog({ ...body, id });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting blog: ${id}`);
    try {
      await this.blogsService.deleteById(id);
      return { success: true, deleted: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
