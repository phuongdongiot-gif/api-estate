import { Controller, Post, Body, Logger } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('webhook/properties')
export class PropertiesController {
  private readonly logger = new Logger(PropertiesController.name);

  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received Sanity webhook for Property: ${payload._id}`);

    // Map Sanity format to Supabase table
    const propertyData = {
      id: payload._id, // Sanity document ID
      transaction_type: payload.transactionType,
      property_category: payload.propertyCategory,
      is_new: payload.isNew || false,
      name: payload.name,
      project_id: payload.projectId,
      project_name: payload.projectName,
      price: payload.price,
      price_num: payload.priceNum,
      location: payload.location,
      type_details: payload.type,
      area: payload.specs?.area,
      area_num: payload.specs?.areaNum,
      beds: payload.specs?.beds,
      baths: payload.specs?.baths,
      description: payload.desc,
      img_url: payload.img,
      gallery: payload.gallery,
    };

    try {
      const data = await this.propertiesService.upsertProperty(propertyData);
      this.logger.log('Successfully synced property cache to Supabase');
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

