import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Services } from './services';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestComponentRenderer } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
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

// Mock AuthService (to prevent automatic POSTs)
const authServiceMock = {
  getTokenAuth: jest.fn().mockReturnValue(of({ token: 'fake' }))
};

describe('Services', () => {
  let component: Services;
  let fixture: ComponentFixture<Services>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Services,
        HttpClientTestingModule
      ],
      providers: [
        provideAnimations(),
        importProvidersFrom(BrowserModule),
        { provide: TestComponentRenderer, useClass: MockComponentRenderer },
        //  WE REGISTER THE MOCK (THIS REMOVES THE 3 AUTOMATIC POSTS)
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();

    const root = document.createElement('div');
    root.id = 'root0';
    document.body.appendChild(root);

    TestBed.overrideComponent(Services, {
      set: { template: '' } // prevents HTML rendering
    });

    fixture = TestBed.createComponent(Services);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);
      });

  it('should create', () => {
    fixture.detectChanges(); // call ngOnInit()
    const req = httpMock.expectOne('http://localhost:3000/api/services');
    expect(req.request.method).toBe('GET');
    req.flush([]); // we simulate an empty response
    expect(component).toBeTruthy();
      
  }); 

  it('should load services on init', () => {
    fixture.detectChanges(); // fire ngOnInit
    const mockServices = [
      { description: 'Handles database connections', id: 1,name: 'Database API' },
      { description: 'Sends automated notifications', id: 2, name: 'Email Service' }
    ];

    // Wait for the initial call to loadServices()
    const req = httpMock.expectOne('http://localhost:3000/api/services');
    expect(req.request.method).toBe('GET');

    req.flush(mockServices);
    
    expect(component.servicesList).toEqual
    (mockServices.sort((a, b) => a.name.localeCompare(b.name))
    );
    });
      
  afterEach(() => {
    httpMock.verify();
  });
});
