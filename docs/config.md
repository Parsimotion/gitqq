# Comando Config

El comando `config` en GitQQ permite gestionar la configuración de la herramienta, incluyendo preferencias de idioma y otras opciones personalizables.

## Descripción

Este comando proporciona una interfaz para ver y modificar la configuración de GitQQ, permitiendo a los usuarios personalizar el comportamiento de la herramienta según sus preferencias.

## Uso básico

```bash
# Mostrar la configuración actual
gitqq config

# Cambiar el idioma
gitqq config language

# Mostrar detalles de la configuración
gitqq config show
```

## Opciones de configuración

### Idioma

GitQQ soporta múltiples idiomas:

- Inglés (English)
- Español
- Portugués (Português)

Para cambiar el idioma:

```bash
gitqq config language
```

Este comando iniciará un proceso interactivo que permite seleccionar el idioma preferido de una lista de opciones disponibles.

## Archivo de configuración

La configuración de GitQQ se almacena en un archivo JSON ubicado en:

```
~/.gitqq/config.json
```

Este archivo contiene todas las preferencias del usuario y se crea automáticamente la primera vez que se utiliza GitQQ.

## Estructura del archivo de configuración

El archivo de configuración tiene la siguiente estructura:

```json
{
  "language": "es",
  "otherSettings": {
    // Configuraciones adicionales
  }
}
```

## Casos de uso comunes

- Cambiar el idioma de la interfaz de usuario.
- Verificar la configuración actual.
- Solucionar problemas relacionados con la configuración.

## Notas

- Los cambios en la configuración se aplican inmediatamente a todas las instancias de GitQQ.
- Si el archivo de configuración se corrompe, GitQQ intentará repararlo o creará uno nuevo con valores predeterminados. 