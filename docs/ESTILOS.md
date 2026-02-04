# Guía de Estilos - E-commerce Template

## Sistema de Colores

### Configuración

Colores en `public/config/store-config.json`:

```json
"colorScheme": {
  "name": "fresh",
  "primary": "#0066CC",
  "secondary": "#FFFFFF",
  "accent": "#00B4D8",
  "background": "#F0F7FF"
}
```

**Formato**:
- Entrada: HEX (`#RRGGBB`)
- Procesamiento: Conversión a OKLCH automática
- Aplicación: Variables CSS para Tailwind

### Variables CSS Generadas

```css
:root {
  --background         /*  Fondo del sitio */
  --foreground         /* Texto principal */
  --primary            /* Color principal */
  --primary-foreground /* Texto sobre primary */
  --secondary          /* Color secundario */
  --accent             /* Color de acento */
  --muted-foreground   /* Texto secundario */
}
```

### Conversión HEX → OKLCH

El archivo `lib/color-utils.ts` convierte automáticamente:
1. HEX → RGB → XYZ → OKLCH
2. Calcula contraste para texto legible

**Ejemplo**:
```
#0066CC → oklch(0.543 0.156 251.234)
             ↓      ↓       ↓
         Lightness Chroma Hue
```

---

## Tipografía

### Esquemas de Fuentes

```json
"typography": {
  "fontScheme": "modern",  // elegant | modern | classic
  "colors": {
    "heading": "#1a1a1a",  // Opcional
    "body": "#2d2d2d",
    "muted": "#6b7280"
  }
}
```

**Esquemas**:
- **elegant**: Playfair Display + Inter
- **modern**: Inter (bold) + Inter
- **classic**: Lora + Merriweather

### Colores de Texto (Opcional)

Si NO se especifican, usa defaults optimizados:
```javascript
{
  heading: "oklch(0.17 0.01 60)",  // Casi negro
  body: "oklch(0.25 0.01 60)",     // Gris oscuro
  muted: "oklch(0.50 0.01 60)"     // Gris medio
}
```

**Aplicación CSS**:
```css
h1, h2, h3, h4, h5, h6 { color: var(--heading-color) !important; }
body, p, span { color: var(--body-text-color); }
.text-muted-foreground { color: var(--muted-text-color) !important; }
```

---

## Contraste y Legibilidad

### Contraste Automático

El sistema calcula contraste automáticamente:

```javascript
// Fondo oscuro → texto blanco
// Fondo claro → texto oscuro

function getContrastingForeground(backgroundHex) {
  const isDark = calculateLuminance(backgroundHex) < 0.5
  return isDark ? "oklch(0.98 0 0)" : "oklch(0.17 0.01 60)"
}
```

**Ejemplo**:
```jsx
<Button className="bg-primary text-primary-foreground">
  Comprar  {/* Texto contrasta automáticamente */}
</Button>
```

### WCAG 2.1 Guidelines

- **AA Normal**: Ratio 4.5:1 (texto normal)
- **AA Large**: Ratio 3:1 (texto grande)
- **AAA**: Ratio 7:1 (óptimo)

---

## Clases Tailwind

### Colores de Fondo

```jsx
className="bg-background"    // Fondo sitio
className="bg-primary"       // Principal
className="bg-secondary"     // Secundario
className="bg-accent"        // Acento
```

### Colores de Texto

```jsx
className="text-foreground"        // Principal
className="text-primary"           // Color primary
className="text-muted-foreground"  // Secundario
className="text-primary-foreground" // Sobre primary
```

### Ejemplos

```jsx
// Botón primario
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Añadir al Carrito
</Button>

// Tarjeta
<Card className="bg-card text-card-foreground border-border">
  <h3 className="text-foreground">Título</h3>
  <p className="text-muted-foreground">Descripción</p>
</Card>

// Badge
<Badge className="bg-accent text-accent-foreground">Nuevo</Badge>
```

---

## Componentes UI

### Button

```jsx
<Button variant="default">Default</Button>     // bg-primary
<Button variant="secondary">Secondary</Button> // bg-secondary
<Button variant="outline">Outline</Button>     // border
<Button variant="ghost">Ghost</Button>         // transparente
```

### Card

```jsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>
```

### Badge

```jsx
<Badge variant="default">Badge</Badge>
<Badge variant="secondary">Badge</Badge>
<Badge variant="outline">Badge</Badge>
```

---

## Mejores Prácticas

### 1. Usar Colores Semánticos

✅ **Hacer**:
```jsx
<h2 className="text-foreground">Título</h2>
<p className="text-muted-foreground">Subtítulo</p>
```

❌ **Evitar**:
```jsx
<h2 className="text-gray-900">Título</h2>
<p className="text-gray-500">Subtítulo</p>
```

### 2. Contraste Automático en Botones

✅ **Hacer**:
```jsx
<Button className="bg-primary text-primary-foreground">Click</Button>
```

❌ **Evitar**:
```jsx
<Button className="bg-primary text-white">Click</Button>
```

### 3. Opacidad

```jsx
<div className="bg-primary/10 text-primary">Fondo sutil</div>
```

### 4. Hover States

```jsx
<Button className="bg-primary hover:bg-primary/90">Hover suave</Button>
```

### 5. Limitar Colores de Texto

Usar solo 2-3 tipos:
1. **Heading** - Títulos (muy oscuro)
2. **Body** - Texto normal (oscuro)
3. **Muted** - Secundario (gris)

---

## Modificar Colores

### Paso 1: Editar store-config.json

```json
{
  "branding": {
    "colorScheme": {
      "primary": "#FF5733",      // Nuevo
      "secondary": "#FFFFFF",
      "accent": "#FFC300",
      "background": "#FFF5E1"
    },
    "typography": {
      "colors": {
        "heading": "#2c2c2c",    // Opcional
        "body": "#3a3a3a",
        "muted": "#757575"
      }
    }
  }
}
```

### Paso 2: Recargar

Colores se aplican automáticamente. No requiere rebuild.

### Paso 3: Verificar Contraste

Herramientas:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

---

## Debugging

### Ver Variables CSS

DevTools > Elements > Computed:
```css
:root {
  --background: oklch(0.97 0.005 60);
  --primary: oklch(0.543 0.156 251.234);
  --foreground: oklch(0.25 0.01 60);
}
```

### Verificar DynamicColorProvider

```html
<head>
  <style id="dynamic-theme-colors">
    :root {
      --background: oklch(...) !important;
      ...
    }
  </style>
</head>
```

Si no aparece:
1. `DynamicColorProvider` en `layout.tsx`
2. `store-config.json` válido
3. No hay errores en consola

---

## Solución de Problemas

### Colores no se aplican

**Causas**:
1. Colores hardcoded → usar clases semánticas
2. CSS con mayor especificidad → usar `!important`
3. `store-config.json` mal formateado → validar JSON

### Texto ilegible

**Causas**:
1. Colores no configurados → agregar `typography.colors`
2. Contraste insuficiente → elegir colores con más diferencia
3. Fondo y texto iguales → verificar `getContrastingForeground()`

---

## Recursos

- [OKLCH Color Picker](https://oklch.com/)
- [Tailwind CSS](https://tailwindcss.com/docs/customizing-colors)
- [shadcn/ui](https://ui.shadcn.com/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última actualización**: 2025-10-15
