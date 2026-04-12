import { Controller, Post, Body, Logger } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  private readonly logger = new Logger(LocationsController.name);

  constructor(private readonly locationsService: LocationsService) {}

  // POST endpoint: /locations/sync-provinces
  @Post('sync-provinces')
  async syncProvinces() {
    return this.locationsService.syncVietnamProvinces();
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Sanity webhook for Location: ${payload._id}`);

    if (payload.action === 'delete' || payload.operation === 'delete' || payload.deleted) {
      try {
        await this.locationsService.deleteById(payload._id);
        this.logger.log('Successfully deleted location from Supabase');
        return { success: true, deleted: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    }

    const locationData = {
      id: payload._id,
      slug: payload.slug?.current || payload.slug,
      name: payload.name,
      hero_image: payload.hero_image,
      lat: payload.lat,
      lng: payload.lng,
    };

    try {
      const data = await this.locationsService.upsertLocation(locationData);
      this.logger.log('Successfully synced location to Supabase');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
