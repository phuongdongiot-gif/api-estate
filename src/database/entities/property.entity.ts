import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('properties')
export class PropertyEntity {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  transaction_type: string;

  @Column({ type: 'varchar', nullable: true })
  property_category: string;

  @Column({ type: 'boolean', default: false })
  is_new: boolean;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  project_id: string;

  @Column({ type: 'varchar', nullable: true })
  project_name: string;

  @Column({ type: 'varchar', nullable: true })
  price: string;

  @Column({ type: 'bigint', nullable: true })
  price_num: number;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  type_details: string;

  @Column({ type: 'varchar', nullable: true })
  area: string;

  @Column({ type: 'double precision', nullable: true })
  area_num: number;

  @Column({ type: 'int', nullable: true })
  beds: number;

  @Column({ type: 'int', nullable: true })
  baths: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  img_url: string;

  @Column({ type: 'text', array: true, nullable: true })
  gallery: string[];

  // --- Đặc điểm BĐS ---
  @Column({ type: 'varchar', nullable: true })
  legal_status: string;

  @Column({ type: 'varchar', nullable: true })
  furniture: string;

  @Column({ type: 'varchar', nullable: true })
  house_direction: string;

  @Column({ type: 'varchar', nullable: true })
  balcony_direction: string;

  @Column({ type: 'int', nullable: true })
  floors: number;

  @Column({ type: 'double precision', nullable: true })
  frontage: number;

  @Column({ type: 'double precision', nullable: true })
  entrance_width: number;

  // --- Thông tin Môi giới ---
  @Column({ type: 'varchar', nullable: true })
  agent_name: string;

  @Column({ type: 'varchar', nullable: true })
  agent_phone: string;

  @Column({ type: 'varchar', nullable: true })
  agent_zalo: string;

  @Column({ type: 'text', nullable: true })
  agent_avatar: string;

  // --- Media ---
  @Column({ type: 'text', nullable: true })
  video_url: string;

  @Column({ type: 'text', nullable: true })
  tour_3d_url: string;

  // --- Map ---
  @Column({ type: 'double precision', nullable: true })
  lat: number;

  @Column({ type: 'double precision', nullable: true })
  lng: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
