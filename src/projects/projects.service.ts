import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../database/entities/project.entity';
import { ProjectAmenityEntity } from '../database/entities/project-amenity.entity';
import { ProjectFloorplanEntity } from '../database/entities/project-floorplan.entity';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(ProjectAmenityEntity)
    private readonly amenityRepo: Repository<ProjectAmenityEntity>,
    @InjectRepository(ProjectFloorplanEntity)
    private readonly floorplanRepo: Repository<ProjectFloorplanEntity>,
  ) {}

  async upsertCompleteProject(projectPayload: any, amenities: any[], floorplans: any[]): Promise<any> {
    try {
      // 1. Upsert Project
      await this.projectRepo.upsert(projectPayload, ['id']);

      // 2. Upsert Amenities
      for (const amen of amenities) {
        const amenData = {
          id: amen._id,
          project_id: projectPayload.id,
          title: amen.title,
          description: amen.description,
        };
        await this.amenityRepo.upsert(amenData, ['id']);
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
        await this.floorplanRepo.upsert(fpData, ['id']);
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Error in upsertCompleteProject:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await this.projectRepo.find({
        relations: ['location', 'amenities', 'floorplans'],
      });
    } catch (error: any) {
      this.logger.error('Error fetching projects:', error.message);
      return [];
    }
  }

  async findBySlug(slug: string): Promise<any | null> {
    return await this.projectRepo.findOne({
      where: { slug },
      relations: ['location', 'amenities', 'floorplans'],
    });
  }

  async deleteById(id: string): Promise<any> {
    try {
      const result = await this.projectRepo.delete(id);
      return result;
    } catch (error: any) {
      this.logger.error('Error deleting project:', error.message);
      throw new Error(error.message);
    }
  }
}
