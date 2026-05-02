import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from '../database/entities/project.entity';
import { ProjectAmenityEntity } from '../database/entities/project-amenity.entity';
import { ProjectFloorplanEntity } from '../database/entities/project-floorplan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ProjectAmenityEntity,
      ProjectFloorplanEntity,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsResolver],
})
export class ProjectsModule {}
