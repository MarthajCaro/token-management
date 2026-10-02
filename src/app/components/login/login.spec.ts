import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';

// Router mock to prevent actual browsing
const routerMock = {
  navigate: jest.fn()
};

// Mock of the AuthService
const authServiceMock = {
  login: jest.fn()
};

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    routerMock.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //  Empty fields
  it('should not submit if form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(component.loginForm.invalid).toBe(true);
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  //  Incorrect credentials
  it('should show error if credentials are incorrect', async () => {
    authServiceMock.login.mockReturnValue(
      throwError(() => ({ status: 401, error: { error: 'Incorrect email or password' } }))
    );

    component.loginForm.setValue({ email: 'wrong@email.com', password: 'wrong12' });
    component.onSubmit();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Incorrect email or password');
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  // Login successful
  it('should navigate to dashboard when login is successful', () => {
    authServiceMock.login.mockReturnValue(
      of({
        access_token: 'fake.jwt.token',
        token_type: 'Bearer',
        expires_in: 300,
        user: { id: 56, name: 'Santiago', email: 'santi@email.com', role: 'admin' }
      })
    );

    component.loginForm.setValue({ email: 'santi@email.com', password: '123456' });
    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith('santi@email.com', '123456');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.errorMessage).toBe('');
    expect(component.loading).toBe(false);
  });

  //  Error connecting to the server
  it('should show error if API fails', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 0 })));

    component.loginForm.setValue({ email: 'santi@email.com', password: '123456' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Error connecting to the server');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});