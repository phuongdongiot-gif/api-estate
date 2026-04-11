import { Resolver, Query, Args } from '@nestjs/graphql';
import { Blog } from './models/blog.model';
import { BlogsService } from './blogs.service';

@Resolver(() => Blog)
export class BlogsResolver {
  constructor(private readonly blogsService: BlogsService) {}

  @Query(() => [Blog], { name: 'blogs' })
  async getBlogs(): Promise<Blog[]> {
    return this.blogsService.findAll();
  }

  @Query(() => Blog, { name: 'blog', nullable: true })
  async getBlog(@Args('slug', { type: () => String }) slug: string): Promise<Blog | null> {
    return this.blogsService.findBySlug(slug);
  }
}

