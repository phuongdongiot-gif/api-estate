import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { LocationEntity } from './location.entity';
import { ProjectAmenityEntity } from './project-amenity.entity';
import { ProjectFloorplanEntity } from './project-floorplan.entity';

@Entity('projects')
export class ProjectEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', unique: true })
  slug: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  location_id: string;

  @ManyToOne(() => LocationEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @Column({ type: 'varchar', nullable: true })
  hero_title: string;

  @Column({ type: 'text', nullable: true })
  hero_desc: string;

  @Column({ type: 'jsonb', nullable: true })
  hero_data: any;

  @Column({ type: 'jsonb', nullable: true })
  overview_data: any;

  @Column({ type: 'jsonb', nullable: true })
  values_data: any;

  @Column({ type: 'jsonb', nullable: true })
  location_data: any;

  @Column({ type: 'double precision', nullable: true })
  lat: number;

  @Column({ type: 'double precision', nullable: true })
  lng: number;

  @OneToMany(() => ProjectAmenityEntity, (a) => a.project, { cascade: true })
  amenities: ProjectAmenityEntity[];

  @OneToMany(() => ProjectFloorplanEntity, (f) => f.project, { cascade: true })
  floorplans: ProjectFloorplanEntity[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
