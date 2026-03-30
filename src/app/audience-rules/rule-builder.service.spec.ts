import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AudienceRulesApiService } from './audience-rules-api.service';
import { RuleBuilderService } from './rule-builder.service';

describe('RuleBuilderService', () => {
  let service: RuleBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AudienceRulesApiService, RuleBuilderService],
    });
    service = TestBed.inject(RuleBuilderService);
  });

  it('should create with a non-empty root', () => {
    expect(service.root().conditions.length).toBeGreaterThan(0);
  });

  it('findGroup should return root when id matches', () => {
    const root = service.root();
    expect(service.findGroup(root.id)).toEqual(root);
  });

  it('findGroup should return null for unknown id', () => {
    expect(service.findGroup('00000000-0000-0000-0000-000000000000')).toBeNull();
  });

  it('setGroupLogic should update group logic', () => {
    const id = service.root().id;
    service.setGroupLogic(id, 'OR');
    expect(service.root().logic).toBe('OR');
  });

  it('getConditionErrors should flag missing value', () => {
    const cond = service.root().conditions[0];
    const errors = service.getConditionErrors(cond);
    expect(errors.value).toBe('Value is required.');
  });

  it('patchCondition should coerce operator when incompatible with field', () => {
    const root = service.root();
    const cond = root.conditions[0];
    service.patchCondition(root.id, cond.id, {
      field: 'purchaseCount',
      operator: 'is',
      value: '3',
    });
    const updated = service.root().conditions.find((c) => c.id === cond.id);
    expect(updated?.field).toBe('purchaseCount');
    expect(updated?.operator).toBe('equals');
  });
});
