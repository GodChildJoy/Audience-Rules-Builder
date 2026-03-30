import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuleBuilderService } from '../rule-builder.service';
import { LogicToggle } from './logic-toggle';

describe('LogicToggle', () => {
  let fixture: ComponentFixture<LogicToggle>;
  let ruleBuilder: RuleBuilderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogicToggle],
      providers: [RuleBuilderService],
    }).compileComponents();

    ruleBuilder = TestBed.inject(RuleBuilderService);
    fixture = TestBed.createComponent(LogicToggle);
    fixture.componentRef.setInput('groupId', ruleBuilder.root().id);
    fixture.componentRef.setInput('logic', 'AND');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show AND helper text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('ALL CONDITIONS MUST MATCH');
  });
});
