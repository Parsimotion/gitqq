# Comando Format-Commits

El comando `format-commits` en GitQQ permite convertir mensajes de commits existentes al formato de [Commits Convencionales](https://www.conventionalcommits.org/), facilitando la estandarización del historial de un repositorio.

## Descripción

Este comando analiza los commits desde un punto específico en el historial hasta HEAD, sugiere formatos convencionales para cada mensaje de commit, y permite al usuario revisar y personalizar estas sugerencias antes de aplicarlas.

## Uso

```bash
gitqq format-commits <hash-del-commit>
```

Donde `<hash-del-commit>` es el hash del commit desde el cual se comenzará la conversión.

## Proceso de conversión

El comando `format-commits` sigue este flujo de trabajo:

1. **Validación**: Verifica que el hash del commit proporcionado exista en el repositorio.

2. **Análisis**: Recupera todos los commits desde el hash especificado hasta HEAD.

3. **Detección automática**: Para cada commit que no siga ya el formato convencional:
   - Analiza el mensaje original para detectar el tipo de cambio (feat, fix, docs, etc.)
   - Identifica posibles ámbitos (scopes) basados en el contenido
   - Detecta si el commit podría representar un cambio disruptivo (breaking change)
   - Sugiere un mensaje reformateado siguiendo la convención

4. **Revisión interactiva**: Presenta cada sugerencia al usuario, permitiendo:
   - Aceptar la sugerencia tal como está
   - Editar la sugerencia (tipo, ámbito, indicador de cambio disruptivo, mensaje)
   - Omitir el commit del proceso de conversión

5. **Confirmación**: Muestra un resumen de todos los cambios propuestos y solicita confirmación final.

6. **Aplicación**: Reescribe los mensajes de commit utilizando `git filter-branch`.

## Características principales

- **Detección inteligente**: Analiza semánticamente los mensajes originales para sugerir el tipo de commit más apropiado.
- **Flujo interactivo**: Permite revisar y personalizar cada sugerencia.
- **Preservación del historial**: Mantiene los autores, fechas y cambios de los commits originales.
- **Soporte multilingüe**: Funciona con el sistema de internacionalización de GitQQ.

## Advertencias

- **Reescritura del historial**: Este comando utiliza `git filter-branch`, que reescribe el historial de Git.
- **Push forzado**: Si el repositorio ya ha sido compartido, será necesario hacer un push forzado después de usar este comando.
- **Colaboración**: La reescritura del historial puede causar problemas para otros colaboradores que trabajen en el mismo repositorio.

## Casos de uso comunes

- Estandarizar el historial de un proyecto antes de su primera versión pública.
- Preparar un proyecto para la generación automática de changelogs.
- Adoptar Commits Convencionales en un proyecto existente.
- Limpiar y estructurar el historial antes de una versión importante. 