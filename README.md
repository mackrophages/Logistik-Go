# Logistik Go (app instalable)

App de los pilotos de Logistik S.A.: bitácora de rutas, kilometraje, entregas y mantenimiento de las unidades.

**Dirección:** https://mackrophages.github.io/Logistik-Go/

## Instalarla en el teléfono

1. Abra la dirección en **Chrome** (Android).
2. Toque **Instalar** cuando Chrome lo ofrezca, o **⋮ → Instalar app** (en algunos teléfonos dice **Agregar a la pantalla principal → Instalar**).
3. Ábrala desde el ícono **Logistik Go**: se abre en pantalla completa, sin la barra de Chrome.

Para entrar, cada piloto elige su nombre y escribe el PIN que le dio la oficina. La app funciona aunque se pierda la
señal: lo que se registra queda en el teléfono y se envía cuando vuelve.

## Qué hay aquí

Solo la pantalla de la app. Los datos se guardan en un Google Sheet privado, a través de su servidor de Apps Script:
este repositorio no contiene datos de pilotos, clientes ni facturas.

Los archivos se generan desde el repositorio privado con `node herramientas/construir-web.js`; no se editan aquí.

`jsQR.min.js`: [jsQR](https://github.com/cozmo/jsQR) 1.4.0, licencia Apache 2.0 (`LICENCIA-jsQR.txt`).
