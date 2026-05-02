import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Property {
  @Field()
  id: string;

  @Field({ nullable: true })
  transaction_type?: string;

  @Field({ nullable: true })
  property_category?: string;

  @Field({ nullable: true })
  is_new?: boolean;

  @Field()
  name: string;

  @Field({ nullable: true })
  project_id?: string;

  @Field({ nullable: true })
  project_name?: string;

  @Field({ nullable: true })
  price?: string;

  @Field(() => Float, { nullable: true })
  price_num?: number;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  area?: string;

  @Field(() => Float, { nullable: true })
  area_num?: number;

  @Field(() => Int, { nullable: true })
  beds?: number;

  @Field(() => Int, { nullable: true })
  baths?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  img_url?: string;

  @Field(() => [String], { nullable: true })
  gallery?: string[];

  // --- Đặc điểm BĐS ---
  @Field({ nullable: true })
  legal_status?: string;

  @Field({ nullable: true })
  furniture?: string;

  @Field({ nullable: true })
  house_direction?: string;

  @Field({ nullable: true })
  balcony_direction?: string;

  @Field(() => Int, { nullable: true })
  floors?: number;

  @Field(() => Float, { nullable: true })
  frontage?: number;

  @Field(() => Float, { nullable: true })
  entrance_width?: number;

  // --- Thông tin Môi giới ---
  @Field({ nullable: true })
  agent_name?: string;

  @Field({ nullable: true })
  agent_phone?: string;

  @Field({ nullable: true })
  agent_zalo?: string;

  @Field({ nullable: true })
  agent_avatar?: string;

  // --- Media ---
  @Field({ nullable: true })
  video_url?: string;

  @Field({ nullable: true })
  tour_3d_url?: string;

  // --- Map ---
  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;
}
