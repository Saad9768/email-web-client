import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service/login.service';
import { LoginData } from '../model/login.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['s@s.s', [Validators.required, Validators.email]],
      password: ['14525', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const loginData: LoginData = {
      username: this.form.get('email') ? this.form.get('email')?.value : '',
      password: this.form.get('password') ? this.form.get('password')?.value : '',
    }
    
    this.loginService.login(loginData)
      .subscribe({
        next: (data) => {
          console.log('data :: ', data)
          localStorage.setItem('username',data.username);
          this.router.navigate(['email-client']);
        }, error: (err) => {
          console.log('err :: ', err)
        }
      });
  }
}