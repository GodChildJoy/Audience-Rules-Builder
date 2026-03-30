// ---------------------------------------------------------------------------
// Logic (how conditions / nested groups combine within one group)
// ---------------------------------------------------------------------------

export const LOGIC_OPERATORS = ['AND', 'OR'] as const;
export type LogicOperator = (typeof LOGIC_OPERATORS)[number];

// ---------------------------------------------------------------------------
// Field catalog — single source of truth; drives labels, operators, and ids
// ---------------------------------------------------------------------------

const FIELD_CATALOG = [
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
] as const;

export type FieldId = (typeof FIELD_CATALOG)[number]['id'];
export type RuleOperatorId = (typeof FIELD_CATALOG)[number]['operators'][number]['id'];

export interface FieldOperatorOption {
  readonly id: RuleOperatorId;
  readonly label: string;
}

export interface FieldSchema {
  readonly id: FieldId;
  readonly label: string;
  readonly operators: readonly FieldOperatorOption[];
}

export const FIELD_OPTIONS: readonly FieldSchema[] = FIELD_CATALOG;

export type OperatorDef = FieldOperatorOption;
export type FieldDef = FieldSchema;

export function getFieldDef(fieldId: string): FieldSchema {
  const found = FIELD_CATALOG.find((f) => f.id === fieldId);
  return (found ?? FIELD_CATALOG[0]) as FieldSchema;
}

export function getOperatorsForField(fieldId: string): readonly FieldOperatorOption[] {
  return getFieldDef(fieldId).operators;
}

// ---------------------------------------------------------------------------
// Editor tree (client state: stable ids for targeting rows / groups)
// ---------------------------------------------------------------------------

export interface RuleCondition {
  readonly id: string;
  field: FieldId;
  operator: RuleOperatorId;
  value: string;
}

export interface RuleGroup {
  readonly id: string;
  logic: LogicOperator;
  conditions: RuleCondition[];
  groups: RuleGroup[];
}

// ---------------------------------------------------------------------------
// Serializable rule tree (API / storage — no client ids)
// ---------------------------------------------------------------------------

export namespace RuleTreePayload {
  export interface Condition {
    field: FieldId;
    operator: RuleOperatorId;
    value: string;
  }

  export interface Group {
    logic: LogicOperator;
    conditions: Condition[];
    groups: Group[];
  }
}

export type MinimalCondition = RuleTreePayload.Condition;
export type MinimalRuleGroup = RuleTreePayload.Group;

export function toMinimalRuleGroup(group: RuleGroup): RuleTreePayload.Group {
  return {
    logic: group.logic,
    conditions: group.conditions.map((c) => ({
      field: c.field,
      operator: c.operator,
      value: c.value,
    })),
    groups: group.groups.map(toMinimalRuleGroup),
  };
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

export function createCondition(fieldId: FieldId = 'country'): RuleCondition {
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
