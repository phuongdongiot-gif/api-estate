import { Controller, Get, Post, Put, Delete, Body, Param, Logger } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('api/properties')
export class PropertiesController {
  private readonly logger = new Logger(PropertiesController.name);

  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const item = await this.propertiesService.findById(id);
    if (!item) return { success: false, msg: 'Not found' };
    return item;
  }

  @Post()
  async create(@Body() body: any) {
    this.logger.log(`Creating property: ${body.name}`);
    try {
      const data = await this.propertiesService.upsertProperty({
        id: body.id || `prop-${Date.now()}`,
        transaction_type: body.transaction_type,
        property_category: body.property_category,
        is_new: body.is_new || false,
        name: body.name,
        project_id: body.project_id,
        project_name: body.project_name,
        price: body.price,
        price_num: body.price_num,
        location: body.location,
        type_details: body.type_details,
        area: body.area,
        area_num: body.area_num,
        beds: body.beds,
        baths: body.baths,
        description: body.description,
        img_url: body.img_url,
        gallery: body.gallery,
        legal_status: body.legal_status,
        furniture: body.furniture,
        house_direction: body.house_direction,
        balcony_direction: body.balcony_direction,
        floors: body.floors ? Number(body.floors) : null,
        frontage: body.frontage ? Number(body.frontage) : null,
        entrance_width: body.entrance_width ? Number(body.entrance_width) : null,
        agent_name: body.agent_name,
        agent_phone: body.agent_phone,
        agent_zalo: body.agent_zalo,
        agent_avatar: body.agent_avatar,
        video_url: body.video_url,
        tour_3d_url: body.tour_3d_url,
        lat: body.lat ? Number(body.lat) : null,
        lng: body.lng ? Number(body.lng) : null,
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    this.logger.log(`Updating property: ${id}`);
    try {
      const data = await this.propertiesService.upsertProperty({ ...body, id });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting property: ${id}`);
    try {
      await this.propertiesService.deleteById(id);
      return { success: true, deleted: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
