import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('api/locations')
export class LocationsController {
  private readonly logger = new Logger(LocationsController.name);

  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  async findAll() {
    return this.locationsService.findAll();
  }

  // POST endpoint: /api/locations/sync-provinces
  @Post('sync-provinces')
  async syncProvinces() {
    return this.locationsService.syncVietnamProvinces();
  }

  @Post()
  async create(@Body() body: any) {
    this.logger.log(`Creating location: ${body.name}`);
    try {
      const data = await this.locationsService.upsertLocation({
        id: body.id || `loc-${Date.now()}`,
        slug: body.slug,
        name: body.name,
        hero_image: body.hero_image,
        lat: body.lat,
        lng: body.lng,
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    this.logger.log(`Updating location: ${id}`);
    try {
      const data = await this.locationsService.upsertLocation({ ...body, id });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting location: ${id}`);
    try {
      await this.locationsService.deleteById(id);
      return { success: true, deleted: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
