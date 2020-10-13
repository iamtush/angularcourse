import { AlertModalComponent } from './../shared/alert-modal/alert-modal.component';
import { AuthResponseData } from './../services/auth.service';
import { Observable } from 'rxjs';
import { FormControl, NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router,
    private ComponentFactoryResolver: ComponentFactoryResolver) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFormSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObs = this.authService.login(
        authForm.value.email,
        authForm.value.password
      );
    } else {
      authObs = this.authService.signUp(
        authForm.value.email,
        authForm.value.password
      );
    }

    authObs.subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      (errorMessage) => {
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );
  }

  showErrorAlert(message: string) {
   const componentFactory = this.ComponentFactoryResolver.resolveComponentFactory(AlertModalComponent);
  }

  getPasswordErrors(password: FormControl) {
    if (password.errors.required) {
      return 'Password Required';
    }
    if (password.errors.minlength) {
      return 'password is of 6 characters';
    }
  }
}
