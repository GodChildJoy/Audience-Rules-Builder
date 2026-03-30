import {
  LOGIC_OPERATORS,
  getFieldDef,
  getOperatorsForField,
  toMinimalRuleGroup,
  type RuleGroup,
} from './rule-builder.model';

describe('rule-builder.model', () => {
  describe('LOGIC_OPERATORS', () => {
    it('should include AND and OR', () => {
      expect(LOGIC_OPERATORS).toContain('AND');
      expect(LOGIC_OPERATORS).toContain('OR');
    });
  });

  describe('getFieldDef', () => {
    it('should return country for unknown id (fallback)', () => {
      expect(getFieldDef('unknown').id).toBe('country');
    });

    it('should return plan for plan', () => {
      expect(getFieldDef('plan').id).toBe('plan');
    });
  });

  describe('getOperatorsForField', () => {
    it('should return signupDate operators', () => {
      const ops = getOperatorsForField('signupDate');
      expect(ops.map((o) => o.id)).toEqual(['before', 'after', 'on']);
    });
  });

  describe('toMinimalRuleGroup', () => {
    it('should strip ids and recurse into nested groups', () => {
      const group: RuleGroup = {
        id: 'root',
        logic: 'OR',
        conditions: [
          { id: 'c1', field: 'country', operator: 'is', value: 'US' },
        ],
        groups: [
          {
            id: 'nested',
            logic: 'AND',
            conditions: [{ id: 'c2', field: 'plan', operator: 'is', value: 'pro' }],
            groups: [],
          },
        ],
      };
      expect(toMinimalRuleGroup(group)).toEqual({
        logic: 'OR',
        conditions: [{ field: 'country', operator: 'is', value: 'US' }],
        groups: [
          {
            logic: 'AND',
            conditions: [{ field: 'plan', operator: 'is', value: 'pro' }],
            groups: [],
          },
        ],
      });
    });
  });
});
