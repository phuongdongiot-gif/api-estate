import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsResolver } from './blogs.resolver';
import { BlogsService } from './blogs.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsResolver],
})
export class BlogsModule {}


