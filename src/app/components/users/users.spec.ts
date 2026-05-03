import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Users } from './users';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestComponentRenderer } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

// Mock renderer required
class MockComponentRenderer {
  insertRootElement(rootElementId: string) {
    let root = document.getElementById(rootElementId);
    if (!root) {
      root = document.createElement('div');
      root.id = rootElementId;
      document.body.appendChild(root);
    }
  }
}

const authServiceMock = {
  getTokenAuth: jest.fn().mockReturnValue(of({ token: 'fake' }))
};

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Users,
        HttpClientTestingModule
      ],
      providers: [
        provideAnimations(),
        importProvidersFrom(BrowserModule),
        { provide: TestComponentRenderer, useClass: MockComponentRenderer },
        { provide: UserService }, // No mocking here, simulated HTTP calls are used.
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    const root = document.createElement('div');
    root.id = 'root0';
    document.body.appendChild(root);

    TestBed.overrideComponent(Users, {
      set: { template: '' } // avoid rendering the actual HTML
    });

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges(); // call ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    httpMock.expectOne('http://localhost:3000/api/users').flush([]);
  });

  it('should load users on init', () => {
    
    const userListMock = [
      {
        id: 32,
        name: 'Johan Muñoz',
        email: 'johan@email.com',
        password: 'qwe.123',
        role: 'editor'
      },
      {
        id: 31,
        name: 'Mafe Gutierrez',
        email: 'mafe@email.com',
        password: 'duwj9.45',
        role: 'reader'
      }
    ];

    // 1) users
    const req1 = httpMock.expectOne('http://localhost:3000/api/users');
    expect(req1.request.method).toBe('GET');
    req1.flush(userListMock);
  
    expect(component.usersList).toEqual(userListMock);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
