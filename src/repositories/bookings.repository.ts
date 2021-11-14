import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Bookings, BookingsRelations, Client} from '../models';
import {ClientRepository} from './client.repository';

export class BookingsRepository extends DefaultCrudRepository<
  Bookings,
  typeof Bookings.prototype.id,
  BookingsRelations
> {

  public readonly client: BelongsToAccessor<Client, typeof Bookings.prototype.id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('ClientRepository') protected clientRepositoryGetter: Getter<ClientRepository>,
  ) {
    super(Bookings, dataSource);
    this.client = this.createBelongsToAccessorFor('client', clientRepositoryGetter,);
    this.registerInclusionResolver('client', this.client.inclusionResolver);
  }
}
