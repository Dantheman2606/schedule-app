# Icon Instructions

To add a custom icon for your Electron app:

## For all platforms:
1. Create or obtain a 512x512 PNG image
2. Save it as `icon.png` in this directory (app/)

## For Windows:
1. Convert your PNG to ICO format (use an online converter or tool like ImageMagick)
2. Save it as `icon.ico` in this directory (app/)

## For macOS:
1. Create an ICNS file (use an online converter or `iconutil` on Mac)
2. Save it as `icon.icns` in this directory (app/)

The electron-packager will automatically use these files when packaging your app.

## Default Behavior:
Without custom icons, electron-packager will use the default Electron icon.
