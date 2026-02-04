# Proceso de Actualización del Template

Cada vez que se modifica el template, hay que hacer **2 cosas**:

## 1. Push del template

```bash
cd /home/mati/projects/middas/ecommerce-template-1
git add -A && git commit -m "descripción del cambio" && git push
```

## 2. Propagar a todas las tiendas

### Opción A: Script directo (recomendado)

```bash
cd /home/mati/projects/middas/backend
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
const templateService = require('./src/services/templateUpdateService');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Updating to v' + templateService.CURRENT_TEMPLATE_VERSION);
    const result = await templateService.updateAllStoreTemplates();
    console.log(JSON.stringify(result.summary, null, 2));
    mongoose.disconnect();
  });
"
```

### Opción B: Via API

```bash
curl -X POST "https://server.middas.app/api/admin/template-update/update-all" \
  -H "x-admin-token: TU_ACCESS_TOKEN"
```

## ⚠️ Importante

1. Si agregás archivos nuevos al template, **agregalos a `FILES_TO_UPDATE`** en:
   `/backend/src/services/templateUpdateService.js`

2. **Incrementar `CURRENT_TEMPLATE_VERSION`** en el mismo archivo

3. Pushear el backend también si modificaste `templateUpdateService.js`

## Checklist rápido

- [ ] Modificar template
- [ ] Push template
- [ ] Agregar archivos nuevos a `FILES_TO_UPDATE` (si aplica)
- [ ] Incrementar `CURRENT_TEMPLATE_VERSION`
- [ ] Push backend (si lo modificaste)
- [ ] Ejecutar script de actualización masiva
