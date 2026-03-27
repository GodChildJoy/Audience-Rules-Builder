export type LogicOperator = 'AND' | 'OR';

export interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface RuleGroup {
  id: string;
  logic: LogicOperator;
  conditions: Condition[];
  groups: RuleGroup[];
}

export const FIELD_OPTIONS = [
  { value: 'country', label: 'country' },
  { value: 'plan', label: 'plan' },
  { value: 'purchaseCount', label: 'purchaseCount' },
  { value: 'signupDate', label: 'signupDate' },
] as const;

export const OPERATOR_OPTIONS = [
  { value: 'is', label: 'is' },
  { value: 'is not', label: 'is not' },
  { value: 'greater than', label: 'greater than' },
  { value: 'less than', label: 'less than' },
  { value: 'before', label: 'before' },
  { value: 'after', label: 'after' },
] as const;

export function createCondition(): Condition {
  return {
    id: crypto.randomUUID(),
    field: 'country',
    operator: 'is',
    value: '',
  };
}

export function createRuleGroup(empty = false): RuleGroup {
  return {
    id: crypto.randomUUID(),
    logic: 'AND',
    conditions: empty ? [] : [createCondition()],
    groups: [],
  };
}
