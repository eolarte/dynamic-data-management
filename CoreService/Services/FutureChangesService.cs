using DynamicDataApi.Models;
using DynamicDataApi.Services;

public class FutureChangesService : BackgroundService
{
    private readonly IServiceProvider _services;
    private readonly ILogger<FutureChangesService> _logger;

    public FutureChangesService(
        IServiceProvider services,
        ILogger<FutureChangesService> logger)
    {
        _services = services;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessFutureChanges();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing future changes");
            }

            await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
        }
    }

    private async Task ProcessFutureChanges()
    {
        using var scope = _services.CreateScope();
        var mongoService = scope.ServiceProvider.GetRequiredService<MongoDbService>();

        var allEmployeeData = await mongoService.GetAllEmployeeDataAsync();
        var now = DateTime.UtcNow;

        foreach (var employeeData in allEmployeeData)
        {
            var hasUpdates = false;
            foreach (var category in employeeData.Data)
            {
                foreach (var field in category.Value)
                {
                    var pendingChanges = field.Value.FutureChanges
                        .Where(f => f.EffectiveDate <= now)
                        .OrderBy(f => f.EffectiveDate)
                        .ToList();

                    if (pendingChanges.Any())
                    {
                        var lastChange = pendingChanges.Last();
                        
                        // Add current value to history
                        field.Value.History.Add(new FieldHistory
                        {
                            Value = field.Value.Value,
                            ChangedAt = now,
                            ChangedBy = "system"
                        });

                        // Update value
                        field.Value.Value = lastChange.Value;
                        
                        // Remove applied changes
                        field.Value.FutureChanges.RemoveAll(f => f.EffectiveDate <= now);
                        
                        hasUpdates = true;
                    }
                }
            }

            if (hasUpdates)
            {
                employeeData.UpdatedAt = now;
                await mongoService.UpdateEmployeeDataAsync(employeeData.Id, employeeData);
            }
        }
    }
} 