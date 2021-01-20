import { Component, OnInit } from '@angular/core';
import {Cart} from '../models/Cart';
import {OrderItem} from '../models/OrderItem';
import {Profile} from '../models/Profile';
import {ItemsService} from '../services/items.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {Purchase} from '../models/Purchase';
import {Item} from '../models/Item';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart;
  orderedItems: OrderItem[] = [];
  profile: Profile;
  token: string;
  username: string;
  purchase: Purchase;
  total: number;
  itemList: Item[] = [];
  subtotal: number;

  constructor(private route: ActivatedRoute, private router: Router, private itemService: ItemsService,
              private userService: UserService) {
    this.token = localStorage.getItem('auth_token');
    this.username = localStorage.getItem('username');
  }

  ngOnInit(): void {
    this.getProfile();
  }

  private getProfile(): void {
    this.userService.getAccounts().subscribe(response => {
      this.profile = response.find(i => i.user.username === this.username);
      this.getCart();
    });
  }

  private getCart(): void {
    this.itemService.getCart().subscribe(response => {
      this.cart = response.find(i => i.user === this.profile.id);
      this.getOrderItems();
    });
  }

  private getOrderItems(): void {
    this.itemService.getOrderItems().subscribe(response => {
      this.orderedItems = response.filter(i => i.cart === this.cart.id);
      this.fillItems();
    });
  }

  private fillItems(): void {
    this.itemService.getItems().subscribe(response => {
      for (const oItem of this.orderedItems ) {
        oItem.item = response.find(i => i.id === oItem.item);
      }
    });
  }

  private getTotal(): void {}

  removeItem(orderId: number): void {
    this.itemService.removeOrderItem(this.token, orderId).subscribe(response => {
      this.orderedItems = this.orderedItems.filter(i => i.id !== orderId);
    });
  }

  decreaseOrderQty(orderId: number): void {}

  increaseOrderQty(orderId: number): void {}

  purchaseCart(): void{}

}
