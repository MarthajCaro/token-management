import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { Router } from '@angular/router';

// Router mock to prevent actual browsing
const routerMock = {
  navigateByUrl: jest.fn().mockResolvedValue(true)
};

describe('Sidebar Component', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //  Component created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ngOnInit correctly assigns the role from localStorage
  it('should set userRole from localStorage', () => {
    localStorage.setItem('role', 'admin');
    component.ngOnInit();
    expect(component.userRole).toBe('admin');
  });

  // ngOnInit assigns “Invited” if there is no saved role
  it('should set userRole to Invited if no role in localStorage', () => {
    localStorage.removeItem('role');
    component.ngOnInit();
    expect(component.userRole.trim()).toBe('Invited');
  });

  // logout should clear localStorage and redirect to login
  it('should clear localStorage and navigate to login on logout', async () => {
    const reloadSpy = jest.fn();
  Object.defineProperty(window, 'location', {
  value: { reload: reloadSpy },
  writable: true,
});

    localStorage.setItem('role', 'admin');

    await component.logout();

    expect(localStorage.getItem('role')).toBeNull();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
    expect(reloadSpy).toHaveBeenCalled();    
  });
});
