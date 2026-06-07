import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarVisitor } from './navbar-visitor';

describe('NavbarVisitor', () => {
  let component: NavbarVisitor;
  let fixture: ComponentFixture<NavbarVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
