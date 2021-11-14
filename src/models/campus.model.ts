import {Entity, model, property, hasOne} from '@loopback/repository';
import {Bookings} from './bookings.model';

@model()
export class Campus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  desc: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  cantPersons: number;

  @property({
    type: 'boolean',
    required: true,
  })
  pool: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  bbq: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  wifi: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  jacuzzi: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  futball: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  volleyball: boolean;

  @hasOne(() => Bookings)
  bookings: Bookings;

  constructor(data?: Partial<Campus>) {
    super(data);
  }
}

export interface CampusRelations {
  // describe navigational properties here
}

export type CampusWithRelations = Campus & CampusRelations;
