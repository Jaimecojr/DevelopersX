import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Bookings,
  Client,
} from '../models';
import {BookingsRepository} from '../repositories';

export class BookingsClientController {
  constructor(
    @repository(BookingsRepository)
    public bookingsRepository: BookingsRepository,
  ) { }

  @get('/bookings/{id}/client', {
    responses: {
      '200': {
        description: 'Client belonging to Bookings',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async getClient(
    @param.path.string('id') id: typeof Bookings.prototype.id,
  ): Promise<Client> {
    return this.bookingsRepository.client(id);
  }
}
