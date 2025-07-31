import type { RuleGroupType, RuleType } from 'react-querybuilder';

export type RulesLogic =
  | string
  | number
  | boolean
  | null
  | { [operator: string]: RulesLogic | RulesLogic[] };

// Explicit types
type FieldName = string;
type OperatorName = '=' | '!=' | '<' | '<=' | '>' | '>=' | 'contains';
type RuleValue = string | number | boolean | null;
type Combinator = 'and' | 'or';

type MyRuleType = RuleType<FieldName, OperatorName, RuleValue, string>;
export type MyRuleGroupType = RuleGroupType<MyRuleType, Combinator>;

export function queryBuilderToJsonLogic(
  ruleGroup: MyRuleGroupType
): RulesLogic {
  if (!ruleGroup.rules || ruleGroup.rules.length === 0) {
    return { and: [] };
  }

  const logic: RulesLogic[] = ruleGroup.rules.map((rule): RulesLogic => {
    if ('rules' in rule) {
      return queryBuilderToJsonLogic(rule as MyRuleGroupType);
    }

    const { field, operator, value } = rule;

    switch (operator) {
      case '=':
        return { '==': [{ var: field }, value] };
      case '!=':
        return { '!=': [{ var: field }, value] };
      case '<':
        return { '<': [{ var: field }, value] };
      case '>':
        return { '>': [{ var: field }, value] };
      case '<=':
        return { '<=': [{ var: field }, value] };
      case '>=':
        return { '>=': [{ var: field }, value] };
      case 'contains':
        return { in: [value, { var: field }] };
      default: {
        const _exhaustiveCheck: never = operator;
        return {};
      }
    }
  });

  return {
    [ruleGroup.combinator || 'and']: logic,
  };
}
