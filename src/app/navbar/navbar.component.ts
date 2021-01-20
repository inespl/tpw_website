import { Component, OnInit } from '@angular/core';
import {Cart} from '../models/Cart';
import {Category} from '../models/Category';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ItemsService} from '../services/items.service';
import {UserService} from '../services/user.service';
import {Profile} from '../models/Profile';
import {OrderItem} from '../models/OrderItem';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string;
  cart: Cart;
  orderedItems: OrderItem[] = [];
  categories: Category[] = [];
  searchForm: FormGroup;
  profile: Profile;

  constructor(private router: Router, private fb: FormBuilder, private itemService: ItemsService, private userService: UserService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      query: ['']
    });
    this.getCategories();
    this.username = localStorage.getItem('username');
    if (this.username) {
      this.getProfile();
    }
  }

  search(): void {
    const query = this.searchForm.value.query;
    this.router.navigateByUrl('/search?q=' + query);
  }

  getCategories(): void {
    this.itemService.getCategories().subscribe(response => {
      this.categories = response;
    });
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

  total(): number {
    let total = 0;
    for (const i of this.orderedItems) {
      if (i.item.discount > 0) {
        total += ((100 - i.item.discount) * i.item.price / 100 * i.qty) ;
      } else {
        total += (i.item.price * i.qty);
      }
    }

    return total;
  }
}
