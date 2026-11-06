// Mirrors password_problems() in backend/app/services/auth_service.py - the
// backend is the real gate; this only lets the form say what's missing live.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_RULES: { label: string; test: (p: string) => boolean }[] = [
  { label: `At least ${PASSWORD_MIN_LENGTH} characters`, test: (p) => p.length >= PASSWORD_MIN_LENGTH },
  { label: 'An uppercase letter', test: (p) => /\p{Lu}/u.test(p) },
  { label: 'A lowercase letter', test: (p) => /\p{Ll}/u.test(p) },
  { label: 'A number', test: (p) => /\p{N}/u.test(p) },
  { label: 'A symbol (e.g. ! @ # $)', test: (p) => /[^\p{L}\p{N}\s]/u.test(p) },
];

export const isStrongPassword = (p: string) => p.length <= PASSWORD_MAX_LENGTH && PASSWORD_RULES.every((r) => r.test(p));
