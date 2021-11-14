import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Client,
  Bookings,
} from '../models';
import {ClientRepository} from '../repositories';

export class ClientBookingsController {
  constructor(
    @repository(ClientRepository) protected clientRepository: ClientRepository,
  ) { }

  @get('/clients/{id}/bookings', {
    responses: {
      '200': {
        description: 'Array of Client has many Bookings',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Bookings)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Bookings>,
  ): Promise<Bookings[]> {
    return this.clientRepository.bookings(id).find(filter);
  }

  @post('/clients/{id}/bookings', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bookings)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Client.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {
            title: 'NewBookingsInClient',
            exclude: ['id'],
            optional: ['clientId']
          }),
        },
      },
    }) bookings: Omit<Bookings, 'id'>,
  ): Promise<Bookings> {
    return this.clientRepository.bookings(id).create(bookings);
  }

  @patch('/clients/{id}/bookings', {
    responses: {
      '200': {
        description: 'Client.Bookings PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {partial: true}),
        },
      },
    })
    bookings: Partial<Bookings>,
    @param.query.object('where', getWhereSchemaFor(Bookings)) where?: Where<Bookings>,
  ): Promise<Count> {
    return this.clientRepository.bookings(id).patch(bookings, where);
  }

  @del('/clients/{id}/bookings', {
    responses: {
      '200': {
        description: 'Client.Bookings DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Bookings)) where?: Where<Bookings>,
  ): Promise<Count> {
    return this.clientRepository.bookings(id).delete(where);
  }
}
