import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { of, throwError } from 'rxjs';

// Router mock to prevent actual browsing
const routerMock = {
  navigate: jest.fn()
};

// Mock of the UserService
const userServiceMock = {
  getUser: jest.fn()
};

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: UserService, useValue: userServiceMock }
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
    expect(userServiceMock.getUser).not.toHaveBeenCalled();
  });

 //  Incorrect credentials
it('should show error if credentials are incorrect', async () => {
  const mockUsers = [
    { id: 16, name: 'Santiago', email: 'santi@email.com', password: '123456', role: 'admin' }
  ];

  (userServiceMock.getUser as jest.Mock).mockReset(); // cleans previous mocks
  (userServiceMock.getUser as jest.Mock).mockReturnValue(of(mockUsers)); // returns correct observable


  component.loginForm.setValue({ email: 'wrong@email.com', password: 'wrong12' });
  component.onSubmit();

  // We let the observable run completely
  await fixture.whenStable();

  // Force Angular change detection
  fixture.detectChanges();

    expect(component.errorMessage).toBe('Incorrect email or password');
});

  // Login successful
  it('should navigate to dashboard when login is successful', () => {
    const mockUsers = [
      { id: 56, name: 'Santiago', email: 'santi@email.com', password: '123456', role: 'admin' }
    ];
    userServiceMock.getUser.mockReturnValue(of(mockUsers));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); // Prevents the real alert from appearing

    component.loginForm.setValue({ email: 'santi@email.com', password: '123456' });
    component.onSubmit();

    expect(localStorage.getItem('loggedUser')).toContain('Santiago');
    expect(localStorage.getItem('role')).toBe('admin');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(alertSpy).toHaveBeenCalledWith('Welcome, Santiago (admin)');
  });

  //  Error connecting to the server
  it('should show error if API fails', () => {
    userServiceMock.getUser.mockReturnValue(throwError(() => new Error('Server error')));

    component.loginForm.setValue({ email: 'santi@email.com', password: '123456' });
    component.onSubmit();

    expect(component.errorMessage).toBe('Error connecting to the server');
  });
});
