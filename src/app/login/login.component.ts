import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';
import {AuthenticationService, UserService} from '../_services';
import {NavbarComponent} from "../navbar/navbar.component";
import {ModalDirective} from "angular-bootstrap-md";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  // Forgot Password Modal
  @ViewChild('forgotPasswordModal') public forgotPasswordModal: ModalDirective;
  forgotPasswordForm: FormGroup;
  forgotPasswordError: string;

  // Register Modal
  @ViewChild('registerModal') public registerModal: ModalDirective;
  registerForm: FormGroup;
  registerError: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.forgotPasswordForm = this.formBuilder.group({
      username: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .subscribe(
        data => {
          if (data) {
            this.router.navigate(['./home']);
          } else {
            this.loading = false;
          }
        });
  }

  forgotPasswordShow() {
    this.forgotPasswordModal.show();
  }

  forgotPasswordSubmit() {
    this.userService.forgotPassword(this.forgotPasswordForm.controls.username.value).subscribe(response => {
      this.forgotPasswordModal.hide();
    }, error => {
      this.forgotPasswordError = error;
    });
  }

  registerShow() {
    this.registerModal.show();
  }

  submitRegister() {
    this.userService.register(this.registerForm.controls.username.value,
      this.registerForm.controls.password.value,
      this.registerForm.controls.first_name.value,
      this.registerForm.controls.last_name.value,
      this.registerForm.controls.email.value).subscribe(response => {
      this.registerModal.hide();
    }, error => {
      this.registerError = error;
    })
  }
}
