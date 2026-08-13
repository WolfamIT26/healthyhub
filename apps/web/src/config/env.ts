export const webEnv = {
  appName: import.meta.env.VITE_APP_NAME ?? 'HealthyHub',
  apiBaseUrl: requirePublicEnvironment(import.meta.env.VITE_API_BASE_URL, 'VITE_API_BASE_URL'),
};

function requirePublicEnvironment(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} là biến môi trường bắt buộc của Web runtime.`);
  }
  return value;
}
