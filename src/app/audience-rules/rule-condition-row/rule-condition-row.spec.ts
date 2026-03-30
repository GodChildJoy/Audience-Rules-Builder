import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudienceRulesApiService } from '../audience-rules-api.service';
import { RuleBuilderService } from '../rule-builder.service';
import { RuleConditionRow } from './rule-condition-row';

describe('RuleConditionRow', () => {
  let fixture: ComponentFixture<RuleConditionRow>;
  let ruleBuilder: RuleBuilderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleConditionRow],
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService, RuleBuilderService],
    }).compileComponents();

    ruleBuilder = TestBed.inject(RuleBuilderService);
    const root = ruleBuilder.root();
    const cond = root.conditions[0];
    fixture = TestBed.createComponent(RuleConditionRow);
    fixture.componentRef.setInput('groupId', root.id);
    fixture.componentRef.setInput('condition', cond);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render field and operator selects', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('select').length).toBe(2);
  });
});
