# TVE en directo

Aplicación web instalable para abrir el Canal 24 Horas de RTVE Noticias desde
un icono en Android.

## Desarrollo

```sh
npm install
npm run dev
```

## Verificación

```sh
npm test
```

## Publicación

`scripts/deploy_web.sh` genera el sitio estático, lo publica en el bucket S3
`tv.cristiancaroli.com` e invalida la distribución de CloudFront. Usa el perfil
AWS `personal` de forma predeterminada.

```sh
./scripts/deploy_web.sh
```

## Instalación en Android

1. Abre `https://tv.cristiancaroli.com` en Chrome.
2. Abre el menú de Chrome.
3. Pulsa **Añadir a pantalla de inicio** o **Instalar aplicación**.
4. Confirma el nombre **TVE Directo**.
5. Abre el nuevo icono y comprueba el sonido.

Si Chrome bloquea la reproducción automática, toca una vez el botón de
reproducción que aparece sobre el vídeo.
