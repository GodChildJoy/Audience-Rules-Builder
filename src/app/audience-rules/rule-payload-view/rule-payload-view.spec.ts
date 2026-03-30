import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { RuleTreePayload } from '../rule-builder.model';
import { RulePayloadView } from './rule-payload-view';

describe('RulePayloadView', () => {
  let fixture: ComponentFixture<RulePayloadView>;

  const sampleGroup: RuleTreePayload.Group = {
    logic: 'AND',
    conditions: [{ field: 'country', operator: 'is', value: 'US' }],
    groups: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulePayloadView],
    }).compileComponents();

    fixture = TestBed.createComponent(RulePayloadView);
    fixture.componentRef.setInput('group', sampleGroup);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render condition field and value in table', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('country');
    expect(el.textContent).toContain('US');
  });
});
