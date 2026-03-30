import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingStateComponent } from './loading-state';

describe('LoadingStateComponent', () => {
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingStateComponent);
    fixture.componentRef.setInput('message', 'Working…');
    fixture.componentRef.setInput('variant', 'inline');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show message and status role', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Working…');
    expect(el.querySelector('[role="status"]')).toBeTruthy();
  });
});
