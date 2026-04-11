import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async upsertCompleteProject(projectPayload: any, amenities: any[], floorplans: any[]): Promise<any> {
    const supabase = this.supabaseService.getClient();

    try {
      // 1. Upsert Project
      const { error: projErr } = await supabase.from('projects').upsert(projectPayload);
      if (projErr) throw new Error('Crashed at Projects: ' + projErr.message);

      // 2. Upsert Amenities
      for (const amen of amenities) {
        const amenData = {
          id: amen._id,
          project_id: projectPayload.id,
          title: amen.title,
          description: amen.description,
        };
        await supabase.from('project_amenities').upsert(amenData);
      }

      // 3. Upsert Floorplans
      for (const fp of floorplans) {
        const fpData = {
          id: fp._id,
          project_id: projectPayload.id,
          name: fp.name,
          area: fp.area,
          beds: fp.beds,
          baths: fp.baths,
        };
        await supabase.from('project_floorplans').upsert(fpData);
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Error in upsertCompleteProject:', error);
      throw error;
    }
  }
}
