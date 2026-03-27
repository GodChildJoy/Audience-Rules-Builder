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

export interface OperatorDef {
  id: string;
  label: string;
}

export interface FieldDef {
  id: string;
  label: string;
  operators: OperatorDef[];
}

export const FIELD_OPTIONS: FieldDef[] = [
  {
    id: 'country',
    label: 'country',
    operators: [
      { id: 'is', label: 'is' },
      { id: 'is not', label: 'is not' },
    ],
  },
  {
    id: 'plan',
    label: 'plan',
    operators: [
      { id: 'is', label: 'is' },
      { id: 'is not', label: 'is not' },
    ],
  },
  {
    id: 'purchaseCount',
    label: 'purchaseCount',
    operators: [
      { id: 'equals', label: 'equals' },
      { id: 'greater than', label: 'greater than' },
      { id: 'less than', label: 'less than' },
    ],
  },
  {
    id: 'signupDate',
    label: 'signupDate',
    operators: [
      { id: 'before', label: 'before' },
      { id: 'after', label: 'after' },
      { id: 'on', label: 'on' },
    ],
  },
];

export function getFieldDef(fieldId: string): FieldDef {
  return FIELD_OPTIONS.find((f) => f.id === fieldId) ?? FIELD_OPTIONS[0];
}

export function getOperatorsForField(fieldId: string): OperatorDef[] {
  return getFieldDef(fieldId).operators;
}

export function createCondition(fieldId = 'country'): Condition {
  const selectedField = getFieldDef(fieldId).id;
  const defaultOperator = getOperatorsForField(selectedField)[0]?.id ?? 'is';
  return {
    id: crypto.randomUUID(),
    field: selectedField,
    operator: defaultOperator,
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
