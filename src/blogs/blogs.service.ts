import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Blog } from './models/blog.model';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Blog[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('blogs').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  }

  async findBySlug(slug: string): Promise<Blog | null> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    return data || null;
  }

  async upsertBlog(blogData: Partial<Blog>): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('blogs').upsert(blogData);

    if (error) {
      this.logger.error('Error upserting blog:', error.message);
      throw new Error(error.message);
    }
    return data;
  }

  async deleteById(id: string): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error('Error deleting blog:', error.message);
      throw new Error(error.message);
    }
    return data;
  }
}
