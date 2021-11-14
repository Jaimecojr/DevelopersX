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
import {Campus} from '../models';
import {CampusRepository} from '../repositories';

export class CampusController {
  constructor(
    @repository(CampusRepository)
    public campusRepository : CampusRepository,
  ) {}

  @post('/campuses')
  @response(200, {
    description: 'Campus model instance',
    content: {'application/json': {schema: getModelSchemaRef(Campus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Campus, {
            title: 'NewCampus',
            exclude: ['id'],
          }),
        },
      },
    })
    campus: Omit<Campus, 'id'>,
  ): Promise<Campus> {
    return this.campusRepository.create(campus);
  }

  @get('/campuses/count')
  @response(200, {
    description: 'Campus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Campus) where?: Where<Campus>,
  ): Promise<Count> {
    return this.campusRepository.count(where);
  }

  @get('/campuses')
  @response(200, {
    description: 'Array of Campus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Campus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Campus) filter?: Filter<Campus>,
  ): Promise<Campus[]> {
    return this.campusRepository.find(filter);
  }

  @patch('/campuses')
  @response(200, {
    description: 'Campus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Campus, {partial: true}),
        },
      },
    })
    campus: Campus,
    @param.where(Campus) where?: Where<Campus>,
  ): Promise<Count> {
    return this.campusRepository.updateAll(campus, where);
  }

  @get('/campuses/{id}')
  @response(200, {
    description: 'Campus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Campus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Campus, {exclude: 'where'}) filter?: FilterExcludingWhere<Campus>
  ): Promise<Campus> {
    return this.campusRepository.findById(id, filter);
  }

  @patch('/campuses/{id}')
  @response(204, {
    description: 'Campus PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Campus, {partial: true}),
        },
      },
    })
    campus: Campus,
  ): Promise<void> {
    await this.campusRepository.updateById(id, campus);
  }

  @put('/campuses/{id}')
  @response(204, {
    description: 'Campus PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() campus: Campus,
  ): Promise<void> {
    await this.campusRepository.replaceById(id, campus);
  }

  @del('/campuses/{id}')
  @response(204, {
    description: 'Campus DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.campusRepository.deleteById(id);
  }
}
