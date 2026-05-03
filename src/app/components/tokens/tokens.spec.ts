import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tokens } from './tokens';
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

//  MOCK AUTHENTICATION SERVICE — ERROR RESOLUTION 
const authServiceMock = {
  getTokenAuth: jest.fn().mockReturnValue(of({ token: 'fake' }))
};

describe('Tokens', () => {
  let component: Tokens;
  let fixture: ComponentFixture<Tokens>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Tokens,
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

    TestBed.overrideComponent(Tokens, {
      set: { template: '' }
    });

    fixture = TestBed.createComponent(Tokens);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // call ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  
    // Consume the 3 requests made in ngOnInit()
    httpMock.expectOne('http://localhost:3000/api/tokens').flush([]);
    httpMock.expectOne('http://localhost:3000/api/users').flush([]);
    httpMock.expectOne('http://localhost:3000/api/services').flush([]);
  });

  it('should load tokens on init', () => {
    const mockTokens = [
      { id: 1, creation_date: '2025-12-01' },
      { id: 2, creation_date: '2025-12-02' }
    ];

    // tokens
    const req1 = httpMock.expectOne('http://localhost:3000/api/tokens');
    expect(req1.request.method).toBe('GET');
    req1.flush(mockTokens);
  
    expect(component.tokenList).toEqual(mockTokens);
  
    // users
    const req2 = httpMock.expectOne('http://localhost:3000/api/users');
    req2.flush([]);
  
    // services
    const req3 = httpMock.expectOne('http://localhost:3000/api/services');
    req3.flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
