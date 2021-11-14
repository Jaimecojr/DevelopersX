import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Campus, CampusRelations, Bookings} from '../models';
import {BookingsRepository} from './bookings.repository';

export class CampusRepository extends DefaultCrudRepository<
  Campus,
  typeof Campus.prototype.id,
  CampusRelations
> {

  public readonly bookings: HasOneRepositoryFactory<Bookings, typeof Campus.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('BookingsRepository') protected bookingsRepositoryGetter: Getter<BookingsRepository>,
  ) {
    super(Campus, dataSource);
    this.bookings = this.createHasOneRepositoryFactoryFor('bookings', bookingsRepositoryGetter);
    this.registerInclusionResolver('bookings', this.bookings.inclusionResolver);
  }
}
