# Práctica: Bloquear JS de CDN externo

## 1. ¿Qué le ocurre a la aplicación al aplicar la cabecera CSP restrictiva?
La aplicación deja de funcionar correctamente. El navegador bloquea la carga del archivo JavaScript externo (de cdn.jsdelivr.net). 
Esto ocurre porque en la configuración de Nginx hemos definido la directiva `script-src 'self'`, que obliga al navegador a ejecutar únicamente scripts alojados en el propio servidor, rechazando cualquier origen externo.

## 2. ¿Qué podemos hacer en la aplicación para evitar ese problema causado por las dependencias externas?
Para solucionar el problema manteniendo la seguridad alta (sin permitir dominios externos), debemos:
1. Descargar el fichero JavaScript (marked.min.js) del CDN.
2. Alojarlo localmente en nuestro servidor (en la misma carpeta que el index.html).
3. Modificar el HTML para cambiar la ruta del script: de una URL absoluta (https://...) a una ruta relativa local (./marked.min.js).

## Estado de la entrega
Se ha aplicado esta solución y la web vuelve a funcionar sin depender de servidores externos.