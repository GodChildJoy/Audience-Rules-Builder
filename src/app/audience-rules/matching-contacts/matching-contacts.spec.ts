import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { RuleBuilderService } from '../rule-builder.service';
import { MatchingContacts } from './matching-contacts';

describe('MatchingContacts', () => {
  let fixture: ComponentFixture<MatchingContacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingContacts],
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService, RuleBuilderService],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchingContacts);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show helper text before preview', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Run preview to see who matches');
  });

  it('preview should show validation error when rule is invalid', () => {
    const btn = fixture.debugElement.query(By.css('button'));
    btn.nativeElement.click();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Fix validation errors');
  });
});
