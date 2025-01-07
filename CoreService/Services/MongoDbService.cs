using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using DynamicDataApi.Models;

namespace DynamicDataApi.Services
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;
        private readonly MongoDbSettings _settings;

        public MongoDbService(IOptions<MongoDbSettings> settings)
        {
            _settings = settings.Value;
            var client = new MongoClient(_settings.ConnectionString);
            _database = client.GetDatabase(_settings.DatabaseName);
        }

        public async Task<string> SaveDynamicDataAsync(string collectionName, DynamicDocument document)
        {
            var collection = _database.GetCollection<DynamicDocument>(collectionName);
            await collection.InsertOneAsync(document);
            return document.Id ?? string.Empty;
        }

        public async Task<DynamicDocumentDto?> GetDynamicDataAsync(string collectionName, string id)
        {
            var collection = _database.GetCollection<DynamicDocumentDto>(collectionName);
            var filter = Builders<DynamicDocumentDto>.Filter.Eq(x => x.Id, id);
            return await collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<List<DynamicDocumentDto>> GetAllDynamicDataAsync(string collectionName)
        {
            var collection = _database.GetCollection<DynamicDocumentDto>(collectionName);
            return await collection.Find(_ => true).ToListAsync();
        }

        public async Task<bool> UpdateDynamicDataAsync(string collectionName, string id, DynamicDocument document)
        {
            var collection = _database.GetCollection<DynamicDocument>(collectionName);
            var filter = Builders<DynamicDocument>.Filter.Eq(x => x.Id, id);
            var result = await collection.ReplaceOneAsync(filter, document);
            return result.ModifiedCount > 0;
        }

        public async Task<string> SaveEmployeeDataAsync(string collectionName, EmployeeData employeeData)
        {
            var collection = _database.GetCollection<EmployeeData>(collectionName);
            await collection.InsertOneAsync(employeeData);
            return employeeData.Id ?? string.Empty;
        }

        public async Task<List<EmployeeData>> GetAllEmployeeDataAsync()
        {
            var collection = _database.GetCollection<EmployeeData>("employeedata");
            return await collection.Find(_ => true).ToListAsync();
        }

        public async Task<T?> GetEmployeeDataByIdAsync<T>(string id) where T : IDocumentEntity
        {
            var collection = _database.GetCollection<T>("employeedata");
            var filter = Builders<T>.Filter.Eq(x => x.Id, id);
            return await collection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<bool> UpdateEmployeeDataAsync(string id, EmployeeData employeeData)
        {
            var collection = _database.GetCollection<EmployeeData>("employeedata");
            var filter = Builders<EmployeeData>.Filter.Eq(x => x.Id, id);
            var result = await collection.ReplaceOneAsync(filter, employeeData);
            return result.ModifiedCount > 0;
        }
    }
} 