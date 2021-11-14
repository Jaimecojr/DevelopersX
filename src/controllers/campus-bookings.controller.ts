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
  Campus,
  Bookings,
} from '../models';
import {CampusRepository} from '../repositories';

export class CampusBookingsController {
  constructor(
    @repository(CampusRepository) protected campusRepository: CampusRepository,
  ) { }

  @get('/campuses/{id}/bookings', {
    responses: {
      '200': {
        description: 'Campus has one Bookings',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bookings),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Bookings>,
  ): Promise<Bookings> {
    return this.campusRepository.bookings(id).get(filter);
  }

  @post('/campuses/{id}/bookings', {
    responses: {
      '200': {
        description: 'Campus model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bookings)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Campus.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {
            title: 'NewBookingsInCampus',
            exclude: ['id'],
            optional: ['campusId']
          }),
        },
      },
    }) bookings: Omit<Bookings, 'id'>,
  ): Promise<Bookings> {
    return this.campusRepository.bookings(id).create(bookings);
  }

  @patch('/campuses/{id}/bookings', {
    responses: {
      '200': {
        description: 'Campus.Bookings PATCH success count',
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
    return this.campusRepository.bookings(id).patch(bookings, where);
  }

  @del('/campuses/{id}/bookings', {
    responses: {
      '200': {
        description: 'Campus.Bookings DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Bookings)) where?: Where<Bookings>,
  ): Promise<Count> {
    return this.campusRepository.bookings(id).delete(where);
  }
}
