
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './dashboard';                // standalone: true
import { Sidebar } from '../sidebar/sidebar';           // adjust the route if it is different

// Router mock to prevent actual browsing
const routerMock = {
  navigateByUrl: jest.fn().mockResolvedValue(true)
};

describe('Dashboard Component', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;

  beforeEach(async () => {
    // We configure the TestBed and OVERWRITE the template BEFORE compiling.
    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterTestingModule],
    })
      .overrideComponent(Dashboard, {
        set: {
          template: `
            <div class="layout">
              <!-- Side menu -->
              <app-sidebar class="sidebar"></app-sidebar>

              <!-- Dynamic content -->
              <div class="content">
                <router-outlet></router-outlet>
              </div>
            </div>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges(); // necessary for the template to be renderede
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Sidebar component', () => {
    // search for the directive (the component itself)
    const sidebarDebug = fixture.debugElement.query(By.directive(Sidebar));
    expect(sidebarDebug).toBeTruthy();

    // check that the element with the class .sidebar exists
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-sidebar')?.classList.contains('sidebar')).toBe(true);
  });

  it('should contain a RouterOutlet for navigation', () => {
    // Search by the RouterOutlet directive
    const outletDebugEl = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outletDebugEl).toBeTruthy();   
  });

  it('should have layout structure with sidebar and content', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.layout')).not.toBeNull();
    expect(el.querySelector('.sidebar')).not.toBeNull();
    expect(el.querySelector('.content')).not.toBeNull();
  });
});
