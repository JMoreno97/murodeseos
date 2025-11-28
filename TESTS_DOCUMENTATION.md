# Test Suite Documentation - Muro de Deseos

## 📋 Resumen de Tests Implementados

Este documento describe los tests creados para asegurar la calidad del código del proyecto Muro de Deseos.

---

## 1. 🔧 Unit Test: Generador de IDs de Grupo

**Archivo**: `__tests__/group-utils.test.ts`

### Función bajo prueba
- `generateUniqueGroupCode(length?: number): Promise<string>`

### Tests implementados (6 tests)

#### ✅ Test 1: Longitud correcta por defecto
```typescript
it('genera un código con la longitud correcta por defecto (6 caracteres)')
```
Verifica que la función genera códigos de 6 caracteres cuando no se especifica una longitud.

#### ✅ Test 2: Longitud personalizada
```typescript
it('genera un código con la longitud especificada')
```
Valida que se puede generar códigos de longitud personalizada (ej: 8 caracteres).

#### ✅ Test 3: Caracteres seguros
```typescript
it('genera un código solo con caracteres alfanuméricos seguros')
```
Asegura que solo usa caracteres del conjunto `SAFE_CHARS`: `23456789ABCDEFGHJKMNPQRSTUVWXYZ`

#### ✅ Test 4: Unicidad
```typescript
it('genera códigos únicos en diferentes llamadas')
```
Verifica que múltiples llamadas generan códigos diferentes (probabilísticamente).

#### ✅ Test 5: Sin caracteres confusos
```typescript
it('no contiene caracteres confusos (O, 0, I, 1, l)')
```
Valida que no se usan caracteres que pueden confundirse visualmente.

#### ✅ Test 6: Solo mayúsculas
```typescript
it('genera solo caracteres en mayúsculas')
```
Confirma que todos los caracteres son mayúsculas para consistencia.

### Resultado
```
✅ Test Suites: 1 passed
✅ Tests: 6 passed
⏱️  Time: ~1.063s
```

---

## 2. 🎨 Component Test: GroupCard

**Archivo**: `__tests__/GroupCard.test.tsx`

### Componente bajo prueba
- `GroupCard` - Tarjeta de visualización de grupo con información y acciones

### Tests implementados (6 tests)

#### ✅ Test 1: Renderizado del título
```typescript
it('muestra correctamente el título del grupo')
```
Verifica que se muestra correctamente:
- Nombre del grupo
- Icono del grupo
- Contador de participantes

#### ✅ Test 2: Truncamiento de participantes
```typescript
it('trunca la lista de participantes cuando son más de 3')
```
Valida que:
- Solo se muestran los primeros 3 participantes
- Los restantes NO aparecen en el DOM
- Se muestra el indicador "... y X más"

#### ✅ Test 3: Botón de eliminar para admin
```typescript
it('muestra el botón de "Eliminar grupo" cuando isAdmin es true')
```
Verifica que cuando `isAdmin=true`:
- Aparece el botón de opciones
- Al hacer clic, se muestra el menú desplegable
- El menú contiene "Eliminar grupo" y "Cambiar nombre"

#### ✅ Test 4: Sin opciones de admin para usuarios normales
```typescript
it('NO muestra opciones de admin cuando isAdmin es false')
```
Asegura que usuarios no-admin no ven el botón de opciones.

#### ✅ Test 5: Sin truncamiento con 3 o menos
```typescript
it('muestra todos los participantes cuando son 3 o menos')
```
Confirma que no se trunca cuando hay 3 o menos participantes.

#### ✅ Test 6: Callback de compartir
```typescript
it('llama a onShare cuando se hace clic en el botón de compartir')
```
Verifica la interacción con el botón de compartir.

### Resultado
```
✅ Test Suites: 1 passed
✅ Tests: 6 passed
⏱️  Time: ~1.159s
```

---

## 3. 🔄 E2E Test: Flujo de Creación de Grupo

**Archivo**: `e2e/create-group.spec.ts`

### Flujo bajo prueba
Flujo completo de creación de grupo desde la home hasta la confirmación

### Tests implementados (3 tests)

#### ✅ Test 1: Flujo completo de creación
```typescript
test('Un usuario puede crear un grupo exitosamente y ser redirigido al detalle')
```

**Pasos del test**:
1. ✅ Usuario entra a la Home (`/`)
2. ✅ Hace clic en "Crear Grupo"
3. ✅ Verifica que está en `/groups/create`
4. ✅ Rellena el formulario con nombre único
5. ✅ Selecciona un icono (opcional)
6. ✅ Envía el formulario
7. ✅ Verifica pantalla de éxito o redirección
8. ✅ Confirma que NO está en `/groups/create`
9. ✅ Verifica que el grupo aparece en la UI

#### ✅ Test 2: Validación de nombre mínimo
```typescript
test('El formulario de creación valida el nombre mínimo')
```

Verifica que:
- No permite nombres de menos de 3 caracteres
- El botón está deshabilitado o la validación HTML5 funciona
- Se habilita con nombre válido

#### ✅ Test 3: Selección de iconos
```typescript
test('Permite seleccionar diferentes iconos para el grupo')
```

Valida que:
- Hay iconos disponibles
- Se pueden seleccionar
- El icono seleccionado muestra feedback visual

### Ejecución
```bash
# Para ejecutar los E2E tests:
npm run test:e2e

# En modo UI interactivo:
npm run test:e2e:ui

# En modo headed (con navegador visible):
npm run test:e2e:headed
```

---

## 📊 Resumen General

| Tipo de Test | Archivo | Tests | Estado |
|--------------|---------|-------|--------|
| **Unit Test** | `group-utils.test.ts` | 6 | ✅ Passing |
| **Component Test** | `GroupCard.test.tsx` | 6 | ✅ Passing |
| **E2E Test** | `create-group.spec.ts` | 3 | ⚠️ Requiere servidor corriendo |

### Total de Tests
- **Unit Tests**: 6 ✅
- **Component Tests**: 6 ✅
- **E2E Tests**: 3 ⚠️
- **Total**: **15 tests**

---

## 🚀 Comandos de Ejecución

```bash
# Ejecutar todos los tests unitarios y de componentes
npm test

# Ejecutar en modo watch
npm run test:watch

# Ver cobertura de código
npm run test:coverage

# Ejecutar solo los tests de una función específica
npm test -- group-utils.test.ts

# Ejecutar E2E tests
npm run test:e2e

# E2E en modo UI
npm run test:e2e:ui
```

---

## 📝 Notas Importantes

### Para E2E Tests
1. ✅ El servidor de desarrollo debe estar corriendo en `http://localhost:3000`
2. ✅ La base de datos debe estar configurada
3. ⚠️ **Importante**: Debes ejecutar `npm run seed` antes de los tests para crear los usuarios de prueba (ej: `juan@test.com` / `Test123!`).
4. ⚠️ Los tests E2E requieren autenticación - puede necesitar ajustes según el middleware

### Cobertura de Código
Los tests actuales cubren:
- ✅ Lógica de generación de IDs
- ✅ Renderizado de componentes
- ✅ Interacciones de usuario
- ✅ Validación de formularios
- ✅ Flujos de navegación

---

## 🔍 Próximos Pasos Recomendados

1. **Aumentar cobertura**: Agregar tests para otros componentes críticos
2. **Tests de integración**: Probar interacciones entre componentes
3. **Tests de deseos**: Agregar tests para el sistema de wishlist
4. **Mock de Supabase**: Mejorar los mocks para tests más realistas
5. **CI/CD**: Integrar los tests en pipeline de CI/CD

---

## 📚 Referencias

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
