import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('project_floorplans')
export class ProjectFloorplanEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  project_id: string;

  @ManyToOne(() => ProjectEntity, (p) => p.floorplans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  area: string;

  @Column({ type: 'int', nullable: true })
  beds: number;

  @Column({ type: 'int', nullable: true })
  baths: number;

  @Column({ type: 'text', nullable: true })
  image_url: string;
}
