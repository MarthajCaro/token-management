import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.loading = true;

    // The backend verifies the credentials and returns the JWT.
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error logging in:', err);
        this.errorMessage =
          err.status === 401
            ? 'Incorrect email or password'
            : 'Error connecting to the server';
      }
    });
  }
}