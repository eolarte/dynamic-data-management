using Microsoft.AspNetCore.Mvc;
using DynamicDataApi.Models;
using DynamicDataApi.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace DynamicDataApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DynamicDataController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;
        private readonly ILogger<DynamicDataController> _logger;

        public DynamicDataController(MongoDbService mongoDbService, ILogger<DynamicDataController> logger)
        {
            _mongoDbService = mongoDbService;
            _logger = logger;
        }

        [HttpGet("{collectionName}")]
        public async Task<IActionResult> GetAllData(string collectionName)
        {
            _logger.LogInformation("Getting all data for collection: {CollectionName}", collectionName);
            try
            {
                var documents = await _mongoDbService.GetAllDynamicDataAsync(collectionName);
                if (documents == null)
                {
                    _logger.LogWarning("No documents found in collection: {CollectionName}", collectionName);
                    return NotFound();
                }

                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting data from collection: {CollectionName}", collectionName);
                throw;
            }
        }

        [HttpGet("{collectionName}/{id}")]
        public async Task<IActionResult> GetData(string collectionName, string id)
        {
            _logger.LogInformation("Getting document {Id} from collection: {CollectionName}", id, collectionName);
            try
            {
                var document = await _mongoDbService.GetDynamicDataAsync(collectionName, id);
                if (document == null)
                {
                    _logger.LogWarning("Document {Id} not found in collection: {CollectionName}", id, collectionName);
                    return NotFound();
                }

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting document {Id} from collection: {CollectionName}", id, collectionName);
                throw;
            }
        }

        [HttpPost("datamodels")]
        public async Task<IActionResult> SaveData([FromBody] JsonElement data)
        {
            _logger.LogInformation("Creating new data model");
            try
            {
                var document = new DynamicDocument
                {
                    Name = data.GetProperty("name").GetString() ?? string.Empty,
                    Description = data.GetProperty("description").GetString() ?? string.Empty,
                    Categories = BsonSerializer.Deserialize<BsonArray>(data.GetProperty("categories").GetRawText()),
                    CollectionName = "datamodels"
                };

                var id = await _mongoDbService.SaveDynamicDataAsync("datamodels", document);
                _logger.LogInformation("Created data model with ID: {Id}", id);
                return Ok(new { id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating data model");
                throw;
            }
        }

        [HttpPut("datamodels/{id}")]
        public async Task<IActionResult> UpdateData(string id, [FromBody] JsonElement data)
        {
            _logger.LogInformation("Updating data model: {Id}", id);
            try
            {
                var document = new DynamicDocument
                {
                    Id = id,
                    Name = data.GetProperty("name").GetString() ?? string.Empty,
                    Description = data.GetProperty("description").GetString() ?? string.Empty,
                    Categories = BsonSerializer.Deserialize<BsonArray>(data.GetProperty("categories").GetRawText()),
                    CollectionName = "datamodels"
                };

                var success = await _mongoDbService.UpdateDynamicDataAsync("datamodels", id, document);
                if (!success)
                {
                    _logger.LogWarning("Data model {Id} not found for update", id);
                    return NotFound();
                }

                _logger.LogInformation("Successfully updated data model: {Id}", id);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating data model: {Id}", id);
                throw;
            }
        }

        [HttpPost("employeedata")]
        public async Task<IActionResult> SaveEmployeeData([FromBody] EmployeeData employeeData)
        {
            _logger.LogInformation("Creating new employee data");
            try
            {
                employeeData.CreatedAt = DateTime.UtcNow;
                var id = await _mongoDbService.SaveEmployeeDataAsync("employeedata", employeeData);
                _logger.LogInformation("Created employee data with ID: {Id}", id);
                return Ok(new { id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee data");
                throw;
            }
        }

        [HttpGet("employeedata")]
        public async Task<IActionResult> GetEmployeeData()
        {
            _logger.LogInformation("Getting all employee data");
            try
            {
                var documents = await _mongoDbService.GetAllEmployeeDataAsync();
                if (documents == null)
                {
                    _logger.LogWarning("No employee data found");
                    return NotFound();
                }

                return Ok(documents);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all employee data");
                throw;
            }
        }

        [HttpGet("employeedata/{id}")]
        public async Task<IActionResult> GetEmployeeDataById(string id)
        {
            _logger.LogInformation("Getting employee data: {Id}", id);
            try
            {
                var document = await _mongoDbService.GetEmployeeDataByIdAsync<EmployeeData>(id);
                if (document == null)
                {
                    _logger.LogWarning("Employee data {Id} not found", id);
                    return NotFound();
                }

                return Ok(document);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee data: {Id}", id);
                throw;
            }
        }

        [HttpPut("employeedata/{id}")]
        public async Task<IActionResult> UpdateEmployeeData(string id, [FromBody] EmployeeDataUpdate updateData)
        {
            _logger.LogInformation("Updating employee data: {Id}", id);
            try
            {
                var existingData = await _mongoDbService.GetEmployeeDataByIdAsync<EmployeeData>(id);
                if (existingData == null)
                {
                    return NotFound();
                }

                var updatedData = new Dictionary<string, Dictionary<string, FieldData>>();

                foreach (var category in updateData.Data)
                {
                    var categoryId = category.Key;
                    updatedData[categoryId] = new Dictionary<string, FieldData>();

                    foreach (var field in category.Value)
                    {
                        var fieldId = field.Key;
                        var fieldUpdate = field.Value;
                        var newValue = fieldUpdate.Value;
                        
                        var existingValue = existingData.Data
                            .GetValueOrDefault(categoryId)?
                            .GetValueOrDefault(fieldId)?.Value;

                        var fieldData = new FieldData
                        {
                            Name = fieldUpdate.Name,
                            Value = fieldUpdate.EffectiveDate == null ? newValue : existingValue,
                            History = new List<FieldHistory>(),
                            FutureChanges = new List<FutureChange>()
                        };

                        // Handle existing history
                        if (existingData.Data.ContainsKey(categoryId) && 
                            existingData.Data[categoryId].ContainsKey(fieldId))
                        {
                            fieldData.History = existingData.Data[categoryId][fieldId].History;
                            fieldData.FutureChanges = existingData.Data[categoryId][fieldId].FutureChanges;
                        }

                        // Handle immediate changes
                        if (fieldUpdate.EffectiveDate == null && existingValue != newValue)
                        {
                            fieldData.History.Add(new FieldHistory
                            {
                                Value = existingValue ?? "",
                                ChangedAt = DateTime.UtcNow,
                                ChangedBy = "system"
                            });
                        }
                        // Handle future changes
                        else if (fieldUpdate.EffectiveDate.HasValue)
                        {
                            // Remove any existing future changes for the same date
                            fieldData.FutureChanges.RemoveAll(f => f.EffectiveDate == fieldUpdate.EffectiveDate.Value.Date);
                            
                            fieldData.FutureChanges.Add(new FutureChange
                            {
                                Value = newValue,
                                EffectiveDate = fieldUpdate.EffectiveDate.Value,
                                CreatedAt = DateTime.UtcNow,
                                CreatedBy = "system"
                            });

                            // Sort future changes by effective date
                            fieldData.FutureChanges = fieldData.FutureChanges
                                .OrderBy(f => f.EffectiveDate)
                                .ToList();
                        }

                        updatedData[categoryId][fieldId] = fieldData;
                    }
                }

                var employeeData = new EmployeeData
                {
                    Id = id,
                    ModelId = updateData.ModelId,
                    ModelName = updateData.ModelName,
                    Data = updatedData,
                    CreatedAt = existingData.CreatedAt,
                    UpdatedAt = DateTime.UtcNow
                };

                var success = await _mongoDbService.UpdateEmployeeDataAsync(id, employeeData);
                if (!success)
                {
                    return NotFound();
                }

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee data: {Id}", id);
                throw;
            }
        }
    }
}