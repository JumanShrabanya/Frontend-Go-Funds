/** Frontend registration policy. Its character requirements match the backend. */
export const passwordPolicy = {
  minLength: 8,
  maxLength: 20,
  allowedCharacters: /^[A-Za-z\d@$!%*?&^#]+$/,
  backendPattern:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/,
};

export const passwordRequirements = [
  { label: '8 to 20 characters', test: (value: string) => value.length >= passwordPolicy.minLength && value.length <= passwordPolicy.maxLength },
  { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'One number', test: (value: string) => /\d/.test(value) },
  { label: 'One special character (@$!%*?&^#)', test: (value: string) => /[@$!%*?&^#]/.test(value) },
  { label: 'Only supported characters', test: (value: string) => value.length > 0 && passwordPolicy.allowedCharacters.test(value) },
] as const;

export function isBackendPassword(value: string): boolean {
  return value.length <= passwordPolicy.maxLength && passwordPolicy.backendPattern.test(value);
}
