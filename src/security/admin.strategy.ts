import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import { HttpErrors, Request } from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import { AuthenticationService } from '../services';

export class AdminStrategy implements AuthenticationStrategy{
  name: string = "admin";
  constructor(@service(AuthenticationService) public serviceAutentication: AuthenticationService)
  {}
  async authenticate(request: Request):Promise<UserProfile|undefined>{
    let token = parseBearerToken(request);
    if(token){
      let data_admin = this.serviceAutentication.ValidateToken(token);
      if(data_admin){
        let admin_info:UserProfile = Object.assign({
          name: data_admin.data.name,
          email: data_admin.data.email
        });
        return admin_info;
      }else{
        throw new HttpErrors[405]("Token invalido");
      }
    }else{
      throw new HttpErrors[405]("No se encontro el token consultado")
    }
  }
}
