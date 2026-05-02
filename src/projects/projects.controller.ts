import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('api/projects')
export class ProjectsController {
  private readonly logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll() {
    return this.projectsService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const item = await this.projectsService.findBySlug(slug);
    if (!item) return { success: false, msg: 'Not found' };
    return item;
  }

  @Post()
  async create(@Body() body: any) {
    this.logger.log(`Creating project: ${body.name}`);
    try {
      const projectData = {
        id: body.id || `proj-${Date.now()}`,
        slug: body.slug,
        name: body.name,
        location_id: body.location_id || null,
        hero_title: body.hero_title,
        hero_desc: body.hero_desc,
        hero_data: body.hero_data,
        overview_data: body.overview_data,
        values_data: body.values_data,
        location_data: body.location_data,
        lat: body.lat,
        lng: body.lng,
      };

      const amenities = body.amenities || [];
      const floorplans = body.floorplans || [];

      const result = await this.projectsService.upsertCompleteProject(projectData, amenities, floorplans);
      this.logger.log(`✅ Created project with ${amenities.length} amenities, ${floorplans.length} floorplans`);
      return { success: true, result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    this.logger.log(`Updating project: ${id}`);
    try {
      const projectData = { ...body, id };
      const amenities = body.amenities || [];
      const floorplans = body.floorplans || [];

      const result = await this.projectsService.upsertCompleteProject(projectData, amenities, floorplans);
      return { success: true, result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting project: ${id}`);
    try {
      await this.projectsService.deleteById(id);
      return { success: true, deleted: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
