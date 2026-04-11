import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Project } from './models/project.model';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(): Promise<Project[]> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('projects').select('*');
    if (error) {
      this.logger.error('Error fetching projects:', error.message);
      return [];
    }
    return data || [];
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }
    return data || null;
  }

  async upsertProject(projectData: any): Promise<any> {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('projects').upsert(projectData);

    if (error) {
      this.logger.error('Error upserting project:', error.message);
      throw new Error(error.message);
    }
    return data;
  }
}
