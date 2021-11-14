import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Client} from './client.model';

@model()
export class Bookings extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    required: true,
  })
  days: number;

  @property({
    type: 'boolean',
    required: true,
  })
  tempAlta: boolean;

  @property({
    type: 'number',
    required: true,
  })
  tempAltaPrice: number;

  @property({
    type: 'number',
    required: true,
  })
  totalPrice: number;

  @belongsTo(() => Client)
  clientId: string;

  @property({
    type: 'string',
  })
  campusId?: string;

  constructor(data?: Partial<Bookings>) {
    super(data);
  }
}

export interface BookingsRelations {
  // describe navigational properties here
}

export type BookingsWithRelations = Bookings & BookingsRelations;
