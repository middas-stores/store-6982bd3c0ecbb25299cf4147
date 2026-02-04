# Configuración de la Tienda - MIDDAS Ecommerce Template

Este documento explica cómo configurar tu tienda ecommerce editando el archivo `public/config/store-config.json`.

## Archivo de Configuración

El archivo `public/config/store-config.json` contiene toda la configuración de tu tienda, incluyendo información del negocio, branding, SEO y tipografía.

## Configuración de SEO

El SEO (Search Engine Optimization) de tu tienda se configura automáticamente desde la sección `seo` del archivo de configuración:

```json
{
  "seo": {
    "title": "Tu Tienda - Tienda Online",
    "description": "Descripción de tu tienda que aparecerá en los resultados de búsqueda",
    "keywords": ["palabra1", "palabra2", "palabra3"]
  }
}
```

### Campos de SEO:

- **title**: El título que aparecerá en la pestaña del navegador y en los resultados de búsqueda de Google.
- **description**: Una descripción breve (150-160 caracteres recomendados) que aparecerá debajo del título en los resultados de búsqueda.
- **keywords**: Un array de palabras clave relacionadas con tu tienda (opcional, pero recomendado para SEO).

El sistema también generará automáticamente metadatos para Open Graph (Facebook, LinkedIn) y Twitter Cards usando el título, descripción y logo de tu tienda.

## Esquemas de Fuentes

Puedes elegir entre 3 combinaciones de fuentes predefinidas para darle estilo a tu tienda. Cada esquema combina una fuente para títulos y otra para el texto del cuerpo.

### Esquemas Disponibles:

#### 1. Elegant (Elegante)
```json
{
  "typography": {
    "fontScheme": "elegant"
  }
}
```
- **Títulos**: Playfair Display (serif elegante)
- **Cuerpo**: Inter (sans-serif moderna)
- **Estilo**: Sofisticado y refinado, ideal para tiendas de moda, joyería o productos premium.

#### 2. Modern (Moderno)
```json
{
  "typography": {
    "fontScheme": "modern"
  }
}
```
- **Títulos**: Montserrat (sans-serif geométrica)
- **Cuerpo**: Roboto (sans-serif limpia)
- **Estilo**: Limpio y contemporáneo, perfecto para tecnología, gadgets o productos modernos.

#### 3. Classic (Clásico)
```json
{
  "typography": {
    "fontScheme": "classic"
  }
}
```
- **Títulos**: Lora (serif tradicional)
- **Cuerpo**: Merriweather (serif legible)
- **Estilo**: Tradicional y confiable, ideal para librerías, productos artesanales o negocios establecidos.

## Ejemplo Completo de Configuración

```json
{
  "storeId": "tu-store-id",
  "apiUrl": "https://tu-api.com",
  "business": {
    "socialMedia": {
      "instagram": "https://instagram.com/tutienda",
      "facebook": "https://facebook.com/tutienda"
    },
    "name": "Mi Tienda",
    "description": "La mejor tienda online",
    "address": "Calle Principal 123, Ciudad",
    "phone": "1234567890",
    "whatsapp": "+541234567890",
    "email": "contacto@mitienda.com"
  },
  "branding": {
    "logo": "https://tu-bucket.s3.amazonaws.com/logo.png",
    "banner": "https://tu-bucket.s3.amazonaws.com/banner.jpg",
    "bannerTitle": "¡Bienvenido a nuestra tienda!",
    "bannerSubtitle": "Encuentra los mejores productos",
    "colorScheme": {
      "name": "elegant",
      "primary": "#000000",
      "secondary": "#D4AF37",
      "accent": "#8B7355",
      "background": "#F5F5F5"
    }
  },
  "settings": {
    "showStock": true,
    "allowOrders": true,
    "orderMethod": "whatsapp",
    "showPrices": true,
    "currency": "ARS",
    "currencySymbol": "$"
  },
  "seo": {
    "title": "Mi Tienda - Los Mejores Productos Online",
    "description": "Encuentra productos de calidad al mejor precio. Envíos a todo el país.",
    "keywords": ["tienda online", "productos", "calidad", "envíos"]
  },
  "typography": {
    "fontScheme": "elegant"
  },
  "analytics": {}
}
```

## Cómo Aplicar los Cambios

1. Edita el archivo `public/config/store-config.json`
2. Modifica los valores de `seo.title`, `seo.description`, `seo.keywords` y `typography.fontScheme`
3. Guarda el archivo
4. Reinicia el servidor de desarrollo (si está corriendo) o despliega los cambios
5. Los cambios se aplicarán automáticamente

## Notas Importantes

- El cambio de esquema de fuentes afectará toda la tipografía del sitio
- Los cambios de SEO son cruciales para el posicionamiento en buscadores
- Asegúrate de usar descripciones claras y títulos descriptivos
- Las palabras clave deben ser relevantes a tu negocio
- El logo en `branding.logo` se usará como imagen para compartir en redes sociales
