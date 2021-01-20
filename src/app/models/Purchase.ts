import {Item} from './Item';
import {User} from './User';

export class Purchase {
  id: number;
  item: Item;
  price: number;
  user: any;
  discountedP: boolean;
}
