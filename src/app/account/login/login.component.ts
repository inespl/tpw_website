import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMsg: string;
  loginGroup: FormGroup;
  token: string;
  loginError: string;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loginGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginGroup.invalid) {
      this.errorMsg = 'Please fill all the fields.';
      return;
    }

    const username = this.loginGroup.value.username;
    const password = this.loginGroup.value.password;
    this.userService.login(username, password).subscribe((response) => {
      this.token = response.token;
      this.loginError = null;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('username', username);
      this.router.navigateByUrl('/');
    }, (error) => {
      this.loginError = 'Something went wrong there. Please check your credentials and try again';
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    this.router.navigateByUrl('/');
  }

}
