# Ruta CR · Examen teórico de manejo en Costa Rica

Aplicación independiente para practicar educación vial, con preguntas originales, explicaciones y referencias. Funciona localmente y en cualquier hosting estático, sin dependencias ni backend.

## Examen de automóvil basado en el manual aportado

El banco de automóvil contiene **93 preguntas originales**, tres por cada uno de los **31 temas** del PDF aportado «Manual del Conductor Costa Rica 2026 — libro completo | Licencia de Conducir CR» (116 páginas, impresión del 22 de octubre de 2026).

- Cada simulacro selecciona una pregunta por tema y nueve adicionales: **40 preguntas distintas, 50 minutos y meta 70/100**.
- Se barajan preguntas y opciones. Las omitidas cuentan como incorrectas.
- Práctica por tema, explicaciones con tema y página del PDF, revisión final y repaso de errores.
- La distribución por temas es una decisión educativa de esta app, no una distribución oficial del examen.
- El perfil de moto conserva su banco complementario de 54 preguntas elegibles. El PDF de automóvil no se usa como sustituto del manual específico de moto.

### Procedencia y límites

El PDF recibido es una impresión de [Licencia de Conducir CR](https://licenciadeconducircr.com/manual-del-conductor-costa-rica-2026-libro-completo/), un sitio de terceros. Aunque el documento se presenta como oficial, su equivalencia con una edición oficial no se ha autenticado. No se redistribuye el PDF ni se reproduce su texto completo.

Las preguntas y explicaciones se redactaron a partir de los conceptos del documento. Se evitaron sus afirmaciones ambiguas o inconsistentes, cifras legales no contrastadas y detalles de trámites que requieren verificación oficial. Las referencias de página corresponden al PDF aportado, no a la paginación del libro oficial. Ver [cobertura por tema](MANUAL-COVERAGE.md).

Esta práctica no garantiza cubrir todas las materias ni preguntas del examen oficial. Desde el 2 de marzo de 2026 se evalúan manuales diferenciados de automóvil y motocicleta. Consultá el manual oficial correspondiente y las fuentes MOPT, COSEVI e Imprenta Nacional enlazadas dentro de la app.

El formato de referencia 40 preguntas/50 minutos proviene del POI COSEVI 2025, página impresa 110; la nota 70, del comunicado MOPT de enero de 2025. No se confirmó el formato íntegro posterior a marzo de 2026. Los contenidos no se actualizan automáticamente.

## Abrir y compartir

Descargá el repositorio como ZIP, descomprimilo y abrí `index.html`. Mantené juntos `index.html`, `style.css`, `questions.js`, `manual-questions.js` y `app.js`.

Para servirlo localmente, desde la carpeta del proyecto, con Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abrí http://localhost:8000. En Windows podés usar `py` en lugar de `python3`. Para compartir en una red privada, usá `--bind 0.0.0.0` y compartí `http://IP-LOCAL:8000` con dispositivos de esa red. La computadora y el servidor deben seguir encendidos. Detenelo con Ctrl+C.

Para publicarlo, subí los cinco archivos de la app a un hosting estático o configurá GitHub Pages para la rama `main`, carpeta raíz. No se necesitan claves ni compilación.

## Progreso y privacidad

El progreso permanece en el navegador, en `localStorage` con clave `ruta-cr-v1`. No hay cuentas, analítica ni sincronización. Los historiales anteriores se conservan; las preguntas antiguas exclusivas de automóvil fueron sustituidas por el nuevo banco y no aparecen en los repasos de automóvil. El contador de preguntas exploradas refleja únicamente el banco del perfil actual. El porcentaje acumulado y el historial incluyen sesiones anteriores.

## Mantener y verificar

- `manual-questions.js`: banco de automóvil; `topic`, `topicTitle` y `manualPage` permiten rastrear cada pregunta.
- `questions.js`: banco complementario anterior, utilizado por el perfil de moto.
- `app.js`: selección por temas, sesiones, resultados y referencias.
- `style.css`: presentación adaptable.

Con Node.js, ejecutá:

```sh
node tests/manual.test.cjs
```

Las pruebas comprueban 93 preguntas, referencias válidas, tres por tema, 100 simulacros de 40 preguntas con 31 temas y sin repeticiones, correspondencia de respuestas tras barajar, filtros, puntuación, finalización por tiempo, repaso, persistencia y separación del banco de moto.
