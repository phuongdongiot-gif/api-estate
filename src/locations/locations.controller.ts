import { Controller, Post } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // POST endpoint: /locations/sync-provinces
  @Post('sync-provinces')
  async syncProvinces() {
    return this.locationsService.syncVietnamProvinces();
  }
}
