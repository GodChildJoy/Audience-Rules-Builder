import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { RuleBuilderService } from '../rule-builder.service';
import { AudienceRulesHeader } from './audience-rules-header';

describe('AudienceRulesHeader', () => {
  let fixture: ComponentFixture<AudienceRulesHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceRulesHeader],
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService, RuleBuilderService],
    }).compileComponents();

    fixture = TestBed.createComponent(AudienceRulesHeader);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show title and Save Rule button', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Audience Rules');
    expect(el.textContent).toContain('Save Rule');
  });
});
