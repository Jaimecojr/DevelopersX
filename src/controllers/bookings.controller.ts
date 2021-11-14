import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Bookings} from '../models';
import {BookingsRepository} from '../repositories';

export class BookingsController {
  constructor(
    @repository(BookingsRepository)
    public bookingsRepository : BookingsRepository,
  ) {}

  @post('/bookings')
  @response(200, {
    description: 'Bookings model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bookings)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {
            title: 'NewBookings',
            exclude: ['id'],
          }),
        },
      },
    })
    bookings: Omit<Bookings, 'id'>,
  ): Promise<Bookings> {
    return this.bookingsRepository.create(bookings);
  }

  @get('/bookings/count')
  @response(200, {
    description: 'Bookings model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Bookings) where?: Where<Bookings>,
  ): Promise<Count> {
    return this.bookingsRepository.count(where);
  }

  @get('/bookings')
  @response(200, {
    description: 'Array of Bookings model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bookings, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Bookings) filter?: Filter<Bookings>,
  ): Promise<Bookings[]> {
    return this.bookingsRepository.find(filter);
  }

  @patch('/bookings')
  @response(200, {
    description: 'Bookings PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {partial: true}),
        },
      },
    })
    bookings: Bookings,
    @param.where(Bookings) where?: Where<Bookings>,
  ): Promise<Count> {
    return this.bookingsRepository.updateAll(bookings, where);
  }

  @get('/bookings/{id}')
  @response(200, {
    description: 'Bookings model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bookings, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bookings, {exclude: 'where'}) filter?: FilterExcludingWhere<Bookings>
  ): Promise<Bookings> {
    return this.bookingsRepository.findById(id, filter);
  }

  @patch('/bookings/{id}')
  @response(204, {
    description: 'Bookings PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {partial: true}),
        },
      },
    })
    bookings: Bookings,
  ): Promise<void> {
    await this.bookingsRepository.updateById(id, bookings);
  }

  @put('/bookings/{id}')
  @response(204, {
    description: 'Bookings PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bookings: Bookings,
  ): Promise<void> {
    await this.bookingsRepository.replaceById(id, bookings);
  }

  @del('/bookings/{id}')
  @response(204, {
    description: 'Bookings DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.bookingsRepository.deleteById(id);
  }
}
