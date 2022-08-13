import { Room } from './../Room/Room';
import { Uuid } from '../../Dto';
import { User } from '../User';
import { Amenity } from '../Amenity';
import { Image } from '../Image';

export type Property = {
    id: Uuid;
    position: Position;
    rentType: RentType;
    // en mètres carrés
    surfaceArea: number;
    commune: string;
    district: string;
    city: string;
    address?: string;
    owner: User;
    noOfRooms: number;
    images: Image[];
    rooms: Room[];
    amenities: Amenity[];
};

export type Position = {
    longitude: number;
    latitude: number;
    // rayon autour de la position en Km
    radius: number;
};

export enum RentType {
    LOCATION = 'LOCATION',
    SHARED_APPARTMENT = 'SHARED_APPARTMENT',
    SHORT_TERM = 'SHORT_TERM'
}

export const RentTypes = Object.values(RentType);
