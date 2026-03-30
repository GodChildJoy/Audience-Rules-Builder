import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { RuleBuilderService } from '../rule-builder.service';
import { RuleGroupComponent } from './rule-group';

describe('RuleGroupComponent', () => {
  let fixture: ComponentFixture<RuleGroupComponent>;
  let ruleBuilder: RuleBuilderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleGroupComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService, RuleBuilderService],
    }).compileComponents();

    ruleBuilder = TestBed.inject(RuleBuilderService);
    fixture = TestBed.createComponent(RuleGroupComponent);
    fixture.componentRef.setInput('groupId', ruleBuilder.root().id);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render AND/OR toggle', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('AND');
    expect(el.textContent).toContain('OR');
  });
});
