public class PicklistOptionsWrapper {
    @AuraEnabled
    public List<SelectOption> picklistOptions { get; set; }
    
    @AuraEnabled
    public List<SelectOption> multiSelectOptions { get; set; }

    public PicklistOptionsWrapper() {
        picklistOptions = new List<SelectOption>();
        multiSelectOptions = new List<SelectOption>();
    }
}