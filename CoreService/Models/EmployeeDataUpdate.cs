public class FieldUpdateData
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public DateTime? EffectiveDate { get; set; }
}

public class EmployeeDataUpdate
{
    public string Id { get; set; } = string.Empty;
    public string ModelId { get; set; } = string.Empty;
    public string ModelName { get; set; } = string.Empty;
    public Dictionary<string, Dictionary<string, FieldUpdateData>> Data { get; set; } 
        = new Dictionary<string, Dictionary<string, FieldUpdateData>>();
} 