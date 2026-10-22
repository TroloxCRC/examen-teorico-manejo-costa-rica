# Ruta CR

App independiente para practicar educación vial en Costa Rica. Revisión de fuentes: 22 de octubre de 2026.

## Abrir sin instalar nada

Descomprimí el ZIP y abrí `index.html` en un navegador moderno. Los cuatro archivos index.html, style.css, questions.js y app.js deben permanecer juntos. No requiere internet para practicar; los enlaces de fuentes sí lo requieren. Algunos navegadores limitan el guardado al abrir archivos directamente: para un origen estable usá el servidor local.

## Hospedar localmente

Con Python 3 instalado, abrí una terminal dentro de esta carpeta y ejecutá:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

En Windows podés usar `py` en lugar de `python3`. Abrí http://localhost:8000. Detené el servidor con Ctrl+C.

## Compartir por Wi-Fi

Desde esta misma carpeta ejecutá:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

Compartí `http://IP-LOCAL-DE-TU-COMPUTADORA:8000` con dispositivos conectados a la misma red. La IP local aparece en la configuración de red del sistema (por ejemplo 192.168.1.25). Si el firewall lo solicita, permití acceso únicamente en tu red privada. La computadora debe seguir encendida y el servidor abierto. Este servidor sencillo es para pruebas y red local; no abras puertos del router para publicarlo en internet.

## Compartir por internet

Podés enviar este ZIP para que cada persona lo abra, o subir index.html, style.css, app.js y questions.js a cualquier hosting de archivos estáticos. index.html debe quedar en la raíz pública. No requiere backend, npm, API keys, base de datos ni proceso de compilación. El historial es independiente para cada navegador y dirección del sitio.

## Funciones

- 60 preguntas originales: 46 comunes, 6 de automóvil y 8 de moto.
- Práctica por tema de hasta 10 preguntas, con explicación inmediata.
- Simulacro con 40 preguntas distintas, 50 minutos y meta de 70/100.
- Opciones y preguntas barajadas; revisión de todas las respuestas al finalizar.
- Las omitidas cuentan como incorrectas. Se puede retroceder durante el simulacro.
- Repaso de errores, historial de hasta 100 sesiones y progreso local.
- Diseño adaptable y controles utilizables con teclado.
- No hay analítica ni recursos remotos necesarios para funcionar.

## Alcance y actualidad

Desde el 2 de marzo de 2026 se evalúan manuales diferenciados de automóvil y motocicleta. Las fuentes enlazadas dentro de la aplicación son MOPT, COSEVI, Imprenta Nacional, PGR, UCR e INA.

No es un banco oficial ni reproduce los manuales 2026. No se obtuvo el texto íntegro de esos manuales y no se garantiza cobertura completa. Debe utilizarse como refuerzo y junto al manual oficial correspondiente.

40 preguntas y 50 minutos proceden del POI COSEVI 2025, página impresa 110. La nota mínima 70 figura en el comunicado MOPT de enero 2025. El formato íntegro posterior al cambio de marzo 2026 no pudo confirmarse; por eso se usa como referencia de práctica, no como promesa del formato real.

La fecha indicada corresponde a revisión editorial, no a actualización automática. Las reglas y trámites pueden cambiar: consultá las fuentes enlazadas antes de presentarte al examen.

## Editar y mantener

El contenido se edita en questions.js. Cada objeto contiene id único, category, vehicle (`ambos`, `automovil` o `moto`), question, options (tres), answer (índice 0 a 2), explanation y source (URL oficial). Mantené un mínimo de 40 preguntas elegibles por perfil. app.js contiene comportamiento y textos; style.css, el diseño.

El progreso usa la clave localStorage `ruta-cr-v1`. Se guarda al finalizar sesiones, no al abandonar una sesión incompleta. Para reiniciarlo usá “Borrar progreso”. Compartir los archivos no comparte tu historial.

## Verificación realizada

Sintaxis JavaScript, estructura y IDs de 60 preguntas; ambos perfiles con 40 preguntas sin repetición; resultados de 100 y 0; finalización por tiempo mediante prueba lógica; eliminación de errores resueltos; filtros y escritura del progreso. En navegador se verificaron la pantalla inicial y el flujo de respuesta, explicación y enlace a la fuente. No se esperaron 50 minutos reales ni se probó en dispositivos físicos.
