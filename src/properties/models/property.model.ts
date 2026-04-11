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
}
