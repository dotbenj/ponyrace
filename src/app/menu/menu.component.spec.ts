import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { MenuComponent } from './menu.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('MenuComponent', () => {
  const fakeUserService = { userEvents: new Subject<UserModel>() } as UserService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MenuComponent],
      providers: [{ provide: UserService, useValue: fakeUserService }]
    })
  );

  it('should have a `navbarCollapsed` field', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService);
    menu.ngOnInit();
    expect(menu.navbarCollapsed)
      .withContext(
        'Check that `navbarCollapsed` is initialized with `true`. Maybe you forgot to declare `navbarCollapsed` in your component.'
      )
      .toBe(true);
  });

  it('should have a `toggleNavbar` method', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService);
    expect(menu.toggleNavbar).withContext('Maybe you forgot to declare a `toggleNavbar()` method').not.toBeNull();

    menu.toggleNavbar();

    expect(menu.navbarCollapsed).withContext('`toggleNavbar()` should change `navbarCollapsed` from `true` to `false`').toBe(false);

    menu.toggleNavbar();

    expect(menu.navbarCollapsed).withContext('`toggleNavbar()` should change `navbarCollapsed` from false to true`').toBe(true);
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar');
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should have the class `collapse`')
      .toContain('collapse');

    const button = element.querySelector('button');
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar');
    expect(navbar.classList)
      .withContext('The element with the id `#navbar` should have not the class `collapse` after a click')
      .not.toContain('collapse');
  });

  it('should use routerLink to navigate', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    expect(links.length).withContext('You should have two routerLink: one to the races, one to the home').toBe(2);
  });

  it('should listen to userEvents in ngOnInit', () => {
    const component = new MenuComponent(fakeUserService);
    component.ngOnInit();

    const user = { login: 'cedric', money: 200 } as UserModel;

    fakeUserService.userEvents.subscribe(() => {
      expect(component.user).withContext('Your component should listen to the `userEvents` observable').toBe(user);
    });

    fakeUserService.userEvents.next(user);
  });

  it('should display the user if logged', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.user = { login: 'cedric', money: 200 } as UserModel;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('span.nav-item.navbar-text.mr-2');
    expect(info)
      .withContext('You should have a `span` element with the classes `nav-item navbar-text mr-2` to display the user info')
      .not.toBeNull();
    expect(info.textContent).withContext('You should display the name of the user in a `span` element').toContain('cedric');
    expect(info.textContent).withContext('You should display the score of the user in a `span` element').toContain('200');
  });

  it('should unsubscribe on destroy', () => {
    const component = new MenuComponent(fakeUserService);
    component.ngOnInit();
    spyOn(component.userEventsSubscription, 'unsubscribe');
    component.ngOnDestroy();

    expect(component.userEventsSubscription.unsubscribe).toHaveBeenCalled();
  });
});
