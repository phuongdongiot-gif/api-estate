import { Controller, Post, Body, Logger } from '@nestjs/common';
import { BlogsService } from './blogs.service';

@Controller('webhook/blogs')
export class BlogsController {
  private readonly logger = new Logger(BlogsController.name);

  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Sanity webhook for Blog: ${payload._id}`);

    if (payload.action === 'delete' || payload.operation === 'delete' || payload.deleted) {
      try {
        await this.blogsService.deleteById(payload._id);
        this.logger.log('Successfully deleted blog from Supabase');
        return { success: true, deleted: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    const blogData = {
      id: payload._id, // sanity document id
      slug: payload.slug?.current || payload.slug,
      date: payload.date,
      title: payload.title,
      description: payload.desc,
      img_url: payload.img,
      content: payload.content, // Might be stored as JSONb in Supabase
    };

    try {
      const data = await this.blogsService.upsertBlog(blogData);
      this.logger.log('Successfully synced blog to Supabase');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

