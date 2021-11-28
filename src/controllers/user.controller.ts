import {authenticate} from '@loopback/authentication';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Keys} from '../config/keys';
import {User} from '../models';
import {Credentials} from '../models/credentials.model';
import {UserRepository} from '../repositories';
import {AuthenticationService} from '../services';
import {NotificationService} from '../services/notification.service';

const fetch = require('node-fetch');

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
    @service(AuthenticationService)
    public authentication_service: AuthenticationService,
    @service (NotificationService)
    public notifications_service: NotificationService
  ) {}
  @authenticate("admin")

  @post('/showUser')
  @response(200, {
    description: 'Specific User'
  })
  async showUser(
    @requestBody() credentials: Credentials
  ){
    let user = await this.authentication_service.ShowInfoUser(credentials.user, credentials.key);
    if(user){
      let token = this.authentication_service.GenerateTokenJWT(user);
      return{
        data:{
          name: user.nameUser,
          email: user.email,
          id: user.id
        },
        tk:token
      }
    }else{
        throw new HttpErrors[401]('Error')
      }
    }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    // return this.userRepository.create(user);
    let password = this.authentication_service.GeneratePasswordFunction();
    let password_ecrypt = this.authentication_service.EncryptPasswordFunction(password);
    user.password = password_ecrypt;
    let inst_user = await this.userRepository.create(user);
    if(inst_user){
      let contenido = `Te damos la bienvenida como colaborador de nuesto equipo.<br>
      Sus datos de acceso al sistema son<br>
      <ul>
        <li>Usuario:${inst_user.email}</li>
        <li>Password:${password}</li>
      </ul>
      Bienvenido...`;
      this.notifications_service.SendMail(inst_user.email, Keys.subject, contenido);
    }
    return inst_user;
    // // Cuerpo del correo electronico
    // let destine = user.email;
    // let subject = `Se realizo el registro como ${user.nameUser}`;
    // let content = `Atento saludo ${user.nameUser} para ingresar su contraseña es ${user.password}`;
    // fetch(`${Keys.urlNotifications}/correos?destido=${destine}&asunto=${subject}&contenido=${content}`)
    //   .then((data: any)=>{
    //     console.log(data);
    //   })
    //   return inst_user;
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
