using Microsoft.AspNetCore.Mvc;
using Reservacion.Domain.Exceptions;

namespace Reservacion.Api.Middleware;

public class ExceptionHandlingMiddleware(
    RequestDelegate next,
    ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (DomainException ex)
        {
            await WriteProblemDetailsAsync(
                context,
                StatusCodes.Status400BadRequest,
                "Regla de negocio incumplida",
                ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            await WriteProblemDetailsAsync(
                context,
                StatusCodes.Status404NotFound,
                "Recurso no encontrado",
                ex.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "Error inesperado procesando {Method} {Path}",
                context.Request.Method,
                context.Request.Path);

            await WriteProblemDetailsAsync(
                context,
                StatusCodes.Status500InternalServerError,
                "Error interno del servidor",
                "Ocurrió un error inesperado al procesar la solicitud.");
        }
    }

    private static async Task WriteProblemDetailsAsync(
        HttpContext context,
        int statusCode,
        string title,
        string detail)
    {
        context.Response.StatusCode = statusCode;

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path
        };

        await context.Response.WriteAsJsonAsync(
            problem,
            options: null,
            contentType: "application/problem+json");
    }
}
