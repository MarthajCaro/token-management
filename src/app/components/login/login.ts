import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service'; 

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
  errorMessage = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    // We get all users from the API.
    this.userService.getUser().subscribe({
      next: (data) => {
        const users = Array.isArray(data) ? data : data.users || [];
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
          // We store active user data
          localStorage.setItem('loggedUser', JSON.stringify(foundUser));
          localStorage.setItem('userId', foundUser.id.toString());        
          localStorage.setItem('role', foundUser.role);                   

          alert(`Welcome, ${foundUser.name} (${foundUser.role})`);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Incorrect email or password';
        }
      },
      error: (err) => {
        console.error('Error retrieving users:', err);
        this.errorMessage = 'Error connecting to the server';
      }
    });
  }
}

