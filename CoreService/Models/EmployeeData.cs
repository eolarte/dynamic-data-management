using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace DynamicDataApi.Models
{
    public class FieldHistory 
    {
        [BsonElement("value")]
        public string Value { get; set; } = string.Empty;

        [BsonElement("changedAt")]
        public DateTime ChangedAt { get; set; }

        [BsonElement("changedBy")]
        public string ChangedBy { get; set; } = string.Empty;
    }

    public class FutureChange
    {
        [BsonElement("value")]
        public string Value { get; set; } = string.Empty;

        [BsonElement("effectiveDate")]
        public DateTime? EffectiveDate { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("createdBy")]
        public string CreatedBy { get; set; } = string.Empty;
    }

    public class FieldData
    {
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("value")]
        public string Value { get; set; } = string.Empty;

        [BsonElement("history")]
        public List<FieldHistory> History { get; set; } = new List<FieldHistory>();

        [BsonElement("futureChanges")]
        public List<FutureChange> FutureChanges { get; set; } = new List<FutureChange>();
    }

    public class FieldValue
    {
        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("value")]
        public string Value { get; set; } = string.Empty;

        [BsonElement("history")]
        public List<FieldHistory> History { get; set; } = new List<FieldHistory>();
    }

    public class EmployeeData : IDocumentEntity
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        [BsonElement("modelId")]
        public string ModelId { get; set; } = string.Empty;

        [BsonElement("modelName")]
        public string ModelName { get; set; } = string.Empty;

        [BsonElement("data")]
        public Dictionary<string, Dictionary<string, FieldData>> Data { get; set; } 
            = new Dictionary<string, Dictionary<string, FieldData>>();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }
    }
} 