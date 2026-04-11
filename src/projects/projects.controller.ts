import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('webhook/projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Sanity webhook for Project: ${payload._id}`);

    // Map Sanity JSON objects perfectly to Supabase JSONB columns
    const projectData = {
      id: payload._id, 
      slug: payload.slug?.current || payload.slug,
      name: payload.name,
      hero_data: payload.hero_data || null,
      overview_data: payload.overview_data || null,
      values_data: payload.values_data || null,
      location_data: payload.location_data || null,
      architecture_data: payload.architecture_data || null,
      amenities_data: payload.amenities_data || null,
      floorplans_data: payload.floorplans_data || null,
      services_data: payload.services_data || null,
    };

    try {
      const data = await this.projectsService.upsertProject(projectData);
      this.logger.log('Successfully synced project data to Supabase');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
