# Potenciado por IA

# Reservacion — Esqueleto en .NET 10 y C# 14

Esqueleto base para una API genérica de reservación de citas construida con **.NET 10**, **C# 14**, **Clean Architecture** y **principios SOLID**, pensado con un nivel intermedio: limpio, directo y fácil de extender sin sobreingeniería.

## Arquitectura (Clean Architecture)

```text
src/
├── Reservacion.Domain/          # Entidades, enums, excepciones e interfaces de repositorio (sin dependencias)
├── Reservacion.Application/     # Casos de uso (servicios), DTOs, contratos y mapeos
├── Reservacion.Infrastructure/  # Implementaciones en memoria listas para pruebas (reemplazables por EF Core)
└── Reservacion.Api/             # Controladores, middleware de errores, DI y configuración HTTP
```

### Flujo de dependencias

- `Reservacion.Domain` no depende de ningún otro proyecto.
- `Reservacion.Application` depende únicamente de `Reservacion.Domain`.
- `Reservacion.Infrastructure` implementa las interfaces definidas en `Domain` (y referencia `Application` si se requiere a futuro).
- `Reservacion.Api` actúa como Composition Root y punto de entrada HTTP.

## Principios SOLID aplicados

- **S (Single Responsibility)**: Cada capa y clase tiene un propósito claro (`Appointment` protege invariantes de negocio, `AppointmentService` orquesta casos de uso, `AppointmentsController` gestiona HTTP y `ExceptionHandlingMiddleware` traduce excepciones a `ProblemDetails`).
- **O (Open/Closed)**: La persistencia se abstrae tras `IAppointmentRepository` e `IServiceItemRepository`, permitiendo agregar EF Core o Dapper sin alterar la lógica de aplicación ni dominio.
- **L (Liskov Substitution)**: Cualquier implementación de `IAppointmentRepository` o `IAppointmentService` puede sustituirse manteniendo el contrato esperado.
- **I (Interface Segregation)**: Interfaces pequeñas y específicas por agregado (`IServiceItemRepository`, `IAppointmentRepository`, `IServiceItemService`, `IAppointmentService`).
- **D (Dependency Inversion)**: `Application` depende de abstracciones de `Domain`; `Api` conecta implementaciones concretas mediante inyección de dependencias.

## Características de C# 14 y .NET 10 usadas

- **`field` keyword (C# 14)**: Validación directa en los `set` de propiedades de dominio (`ServiceItem` y `Appointment`) sin declarar campos privados manualmente.
- **Extension blocks (`extension(...)` de C# 14)**: Mapeo limpio a DTOs en `DomainMappings` y registro de dependencias en `ServiceCollectionExtensions`.
- **Primary constructors**: Inyección de dependencias concisa en servicios, controladores, middleware y excepciones.
- **`System.Threading.Lock` (.NET 10)**: Sincronización ligera y segura en los repositorios en memoria.
- **Records**: DTOs inmutables de entrada y salida.

## Cómo compilar y ejecutar

1. Compilar toda la solución:

```powershell
dotnet build
```

2. Ejecutar la API:

```powershell
dotnet run --project src/Reservacion.Api
```

La API quedará escuchando por defecto en `http://localhost:5150`. Puedes probar los endpoints con el archivo [Reservacion.Api.http](src/Reservacion.Api/Reservacion.Api.http) o con `curl` / Postman.

## Frontend de prueba (React + Vite)

En la carpeta `client/` hay una interfaz web en React + TypeScript conectada a la API mediante proxy (`/api` -> `http://localhost:5150`).

```powershell
cd client
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador (con la API ejecutándose en paralelo).
