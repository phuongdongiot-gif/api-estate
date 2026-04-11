import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsResolver],
})
export class ProjectsModule {}
