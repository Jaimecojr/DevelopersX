import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import { User } from '../models';
import {Keys} from '../config/keys';

const generate_password = require('password-generator');
const encryptar_password = require('crypto-js');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  constructor(
    @repository(UserRepository)
    public user_repository: UserRepository
  ) {}

  GeneratePasswordFunction(){
      let password = generate_password(6,false);
      return password;
  }

  EncryptPasswordFunction(password:string){
      let password_encrypt = encryptar_password.MD5(password).toString();
      return password_encrypt;
  }

  ShowInfoUser(user_email:string, password:string){
    try {
      let user = this.user_repository.findOne({where:{email: user_email, password:password}});
      if(user){
        return user;
      }
      return false;
    } catch {
      return false;
    }
  }

  GenerateTokenJWT(user:User){
    let token = jwt.sign({
      data: {
        id: user.id,
        name: user.nameUser,
        email: user.email
      }
    },
    Keys.JWTkey);
    return token;
  }

  ValidateToken(token:string){
    try {
      let datos = jwt.verify(token, Keys.JWTkey);
      return datos;
    } catch {
      return false;
    }
  }
}
