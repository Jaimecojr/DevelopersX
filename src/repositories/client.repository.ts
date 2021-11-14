import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Client, ClientRelations, Bookings} from '../models';
import {BookingsRepository} from './bookings.repository';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.id,
  ClientRelations
> {

  public readonly bookings: HasManyRepositoryFactory<Bookings, typeof Client.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('BookingsRepository') protected bookingsRepositoryGetter: Getter<BookingsRepository>,
  ) {
    super(Client, dataSource);
    this.bookings = this.createHasManyRepositoryFactoryFor('bookings', bookingsRepositoryGetter,);
    this.registerInclusionResolver('bookings', this.bookings.inclusionResolver);
  }
}
