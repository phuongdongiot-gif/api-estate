import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { createClient } from '@sanity/client';

@Controller('webhook/projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);
  private sanity: any;

  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Webhook for Project: ${payload._id}`);
    if (!payload._id) return { success: false, msg: 'No ID' };

    try {
      const sanityClient = createClient({
        projectId: process.env.SANITY_PROJECT_ID || 'missing',
        dataset: process.env.SANITY_DATASET || 'production',
        token: process.env.SANITY_TOKEN,
        useCdn: false,
        apiVersion: '2024-04-11',
      });

      // Dùng GROQ Query lấy dữ liệu con (References) đã nở toàn bộ
      const groqQuery = `*[_id == $id][0]{
        ...,
        location->,
        amenities_ref[]->,
        floorplans_ref[]->
      }`;
      const expandedParams = { id: payload._id };
      const expandedDoc = await sanityClient.fetch(groqQuery, expandedParams);

      if (!expandedDoc) return { success: false, msg: 'Doc Not Found via GROQ' };

      // Chế biến Project lõi
      const projectData = {
        id: expandedDoc._id, 
        slug: expandedDoc.slug?.current || expandedDoc.slug,
        location_id: expandedDoc.location?._id || null,
        name: expandedDoc.name,
        hero_title: expandedDoc.hero_data?.titleLine1,
        hero_desc: expandedDoc.hero_data?.description,
      };

      const amenities = expandedDoc.amenities_ref || [];
      const floorplans = expandedDoc.floorplans_ref || [];

      // Phân tán vào Supabase
      const result = await this.projectsService.upsertCompleteProject(projectData, amenities, floorplans);
      
      this.logger.log(`✅ Synced Project, ${amenities.length} amenities, ${floorplans.length} floorplans to Supabase`);
      return { success: true, result };
    } catch (error: any) {
      this.logger.error('Webhook Error: ' + error.message);
      return { success: false, error: error.message };
    }
  }
}
