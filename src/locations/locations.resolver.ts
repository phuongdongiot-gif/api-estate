import { Resolver, Query } from '@nestjs/graphql';
import { LocationsService } from './locations.service';
import { Location } from './models/location.model';

@Resolver(() => Location)
export class LocationsResolver {
  constructor(private readonly locationsService: LocationsService) {}

  @Query(() => [Location])
  async locations(): Promise<Location[]> {
    return this.locationsService.findAll();
  }
}
