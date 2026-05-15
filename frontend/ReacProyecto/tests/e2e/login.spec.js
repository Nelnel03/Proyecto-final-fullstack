import { test, expect } from '@playwright/test';

test.describe('Flujo de Autenticación', () => {
  test('debe permitir al usuario iniciar sesión y ver el dashboard', async ({ page }) => {
    // Ir a la página de login (ajustar puerto si es necesario)
    await page.goto('http://localhost:5173/login');

    // Llenar el formulario
    await page.fill('input[type="email"]', 'admin@reforestacion.com');
    await page.fill('input[type="password"]', 'admin123');

    // Hacer clic en entrar
    await page.click('button:has-text("Entrar")');

    // Verificar redirección o mensaje de bienvenida
    // Nota: Esto depende de la velocidad de la API y el entorno
    await expect(page).toHaveURL(/.*admin/);
  });
});
