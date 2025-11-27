# Configuración de Testing - Muro de Deseos

## ✅ Resumen de la Configuración

Se ha configurado un entorno de testing robusto con:

### 1. Testing Unitario y de Integración (Jest + React Testing Library)

**Paquetes instalados:**
- `jest` - Framework de testing
- `@testing-library/react` - Testing utilities para React
- `@testing-library/jest-dom` - Matchers personalizados para DOM
- `@testing-library/user-event` - Simulación de eventos de usuario
- `jest-environment-jsdom` - Entorno DOM para Jest
- `@types/jest` - Tipos de TypeScript para Jest

**Archivos de configuración:**
- `jest.config.js` - Configuración principal de Jest con soporte para Next.js
- `jest.setup.js` - Mocks globales (Supabase, Next.js navigation)

**Scripts disponibles:**
```bash
npm test                # Ejecutar todos los tests
npm run test:watch      # Modo watch (re-ejecuta al guardar)
npm run test:coverage   # Generar reporte de cobertura
```

**Tests de ejemplo creados:**
- `__tests__/login.test.tsx` - Test del componente de Login
- `__tests__/GroupCard.test.tsx` - Test del componente GroupCard

### 2. Testing End-to-End (Playwright)

**Paquetes instalados:**
- `@playwright/test` - Framework E2E testing

**Archivos de configuración:**
- `playwright.config.ts` - Configuración de Playwright con múltiples navegadores

**Scripts disponibles:**
```bash
npm run test:e2e           # Ejecutar tests E2E (headless)
npm run test:e2e:ui        # Modo UI interactivo
npm run test:e2e:headed    # Con navegador visible
```

**Tests E2E de ejemplo creados:**
- `e2e/landing.spec.ts` - Tests de la landing page
- `e2e/login.spec.ts` - Tests del flujo de login

**Navegadores configurados:**
- Desktop: Chrome, Firefox, Safari
- Mobile: Pixel 5, iPhone 12

### 3. Características Implementadas

✅ **Soporte completo para TypeScript**
✅ **Mocks automáticos de Supabase** (auth, database)
✅ **Mocks de Next.js** (router, navigation)
✅ **Cobertura de código** configurada
✅ **Tests excluyen carpeta e2e** (no conflicto entre Jest y Playwright)
✅ **Auto-start del dev server** para tests E2E
✅ **Screenshots automáticos** en fallos (Playwright)
✅ **Reintentos automáticos** en CI (Playwright)
✅ **Reportes HTML** de tests E2E

### 4. Archivos Actualizados

- `.gitignore` - Excluye reportes y resultados de tests
- `package.json` - Scripts de testing añadidos
- `TESTING.md` - Documentación completa de testing

## 🚀 Próximos Pasos

1. **Ejecutar los tests:**
   ```bash
   npm test
   npm run test:e2e
   ```

2. **Añadir más tests:**
   - Crear tests para componentes críticos
   - Añadir tests E2E para flujos completos (signup, crear grupo, etc.)

3. **Integración CI/CD:**
   - Los tests están listos para ejecutarse en CI
   - Playwright se ejecuta en modo headless automáticamente en CI

4. **Mejorar cobertura:**
   - Ejecutar `npm run test:coverage` para ver áreas sin cubrir
   - Objetivo: >80% de cobertura en componentes críticos

## 📝 Notas Importantes

- Los tests unitarios se ejecutan rápidamente (~1-2s)
- Los tests E2E toman más tiempo (inician el servidor)
- Los mocks de Supabase permiten testing sin conexión real a la DB
- Playwright genera reportes HTML detallados en `playwright-report/`

## 🐛 Troubleshooting

**Si los tests fallan:**
1. Verificar que las dependencias estén instaladas: `npm install`
2. Limpiar cache de Jest: `npm test -- --clearCache`
3. Para Playwright: `npx playwright install` (reinstalar navegadores)

**Si hay conflictos entre Jest y Playwright:**
- Jest ignora la carpeta `e2e/` automáticamente
- Playwright solo ejecuta archivos `*.spec.ts` en `e2e/`
