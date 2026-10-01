export type RuleMessage = {
  message?: string;
};

export type RuleValue<T> = T | (RuleMessage & { value: T });

export function getRuleValue<T>(rule: T | RuleMessage | RuleValue<T>): T | undefined {
  if (typeof rule === 'object' && rule !== null && 'message' in rule && !('value' in rule)) {
    const keys = Object.keys(rule);
    if (keys.length === 1) {
      return true as T;
    }
  }

  if (typeof rule === 'object' && rule !== null && 'value' in rule) {
    return (rule as { value: T }).value;
  }

  return rule as T;
}

export function isRuleEnabled(rule: unknown): boolean {
  return rule === true || (typeof rule === 'object' && rule !== null);
}

export function getRuleMessage(rule: unknown): string | undefined {
  if (typeof rule === 'object' && rule !== null && 'message' in rule) {
    const message = (rule as RuleMessage).message;
    return typeof message === 'string' ? message : undefined;
  }

  return undefined;
}

export function applyRuleMessage(errors: string[], rule: unknown): string[] {
  const message = getRuleMessage(rule);
  return errors.length > 0 && message ? [message] : errors;
}
