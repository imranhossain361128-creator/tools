// Replaces {{placeholders}} in a saved schema template with real values from
// the current post or category. Any placeholder without a matching value is
// left as an empty string rather than breaking the JSON.
export function applyPlaceholders(template, data) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    const value = data[key];
    if (value === undefined || value === null) return '';
    return String(value);
  });
}

export const AVAILABLE_PLACEHOLDERS_CONTENT = [
  '{{title}}',
  '{{excerpt}}',
  '{{url}}',
  '{{siteName}}',
  '{{date}}',
  '{{toolName}}',
  '{{rating}}',
  '{{pricing}}',
];

export const AVAILABLE_PLACEHOLDERS_CATEGORY = [
  '{{categoryName}}',
  '{{categoryDescription}}',
  '{{url}}',
  '{{siteName}}',
];
