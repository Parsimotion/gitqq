# Comando Init-Project

El comando `init-project` en GitQQ permite inicializar rápidamente un nuevo repositorio Git con un commit inicial siguiendo las mejores prácticas de desarrollo.

## Descripción

Este comando simplifica el proceso de inicialización de un nuevo proyecto Git, automatizando los pasos iniciales que normalmente se realizarían manualmente.

## Uso

```bash
gitqq init-project
```

## Acciones realizadas

El comando `init-project` realiza las siguientes acciones en secuencia:

1. **Inicialización del repositorio**: Ejecuta `git init` para crear un nuevo repositorio Git en el directorio actual.

2. **Creación del commit inicial**: Crea un commit inicial vacío con el mensaje "(chore): initial commit".
   - Este commit sigue el formato de Commits Convencionales.
   - El uso de un commit vacío establece una base limpia para el historial del proyecto.

## Beneficios

- **Rapidez**: Inicializa un repositorio Git con un solo comando.
- **Consistencia**: Asegura que todos los proyectos comiencen con la misma estructura de commits.
- **Mejores prácticas**: Sigue las convenciones de Commits Convencionales desde el inicio del proyecto.
- **Integración**: Se integra perfectamente con el flujo de trabajo de GitQQ para la gestión de commits semánticos.

## Casos de uso comunes

- Iniciar un nuevo proyecto de desarrollo.
- Convertir un proyecto existente en un repositorio Git.
- Establecer una base limpia para un proyecto que se va a migrar desde otro sistema de control de versiones.

## Notas

- Este comando debe ejecutarse en un directorio que no sea ya un repositorio Git.
- Si el directorio ya contiene un repositorio Git, el comando mostrará un error apropiado. 