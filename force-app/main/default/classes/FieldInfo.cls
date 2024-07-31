public class FieldInfo {
    @AuraEnabled
    public String name { get; set; }
    @AuraEnabled
    public String label { get; set; }
    @AuraEnabled
    public String type { get; set; }

    public FieldInfo(String name, String label, String type) {
        this.name = name;
        this.label = label;
        this.type = type;
    }
}