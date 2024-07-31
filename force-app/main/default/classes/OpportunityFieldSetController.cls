public with sharing class OpportunityFieldSetController {
   @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getFieldSetValues() {
        List<Map<String, Object>> fieldSetValues = new List<Map<String, Object>>();
        Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get('Salesforce_Objectss__c');
        Schema.DescribeSObjectResult describeSObjectResult = sObjectType.getDescribe();
        Schema.FieldSet fieldSet = describeSObjectResult.fieldSets.getMap().get('fecth_salesforce_fileds');

        for (Schema.FieldSetMember fieldSetMember : fieldSet.getFields()) {
            Map<String, Object> fieldInfo = new Map<String, Object>();
            fieldInfo.put('label', fieldSetMember.getLabel());
            fieldInfo.put('fieldName', fieldSetMember.getFieldPath());
            
            // Get the field describe result
            Schema.DescribeFieldResult fieldDescribe = fieldSetMember.getFieldPath().split('\\.').size() > 1 ? 
                describeSObjectResult.fields.getMap().get(fieldSetMember.getFieldPath().split('\\.')[1]).getDescribe() : 
                describeSObjectResult.fields.getMap().get(fieldSetMember.getFieldPath()).getDescribe();
                
            if (fieldDescribe.getType() == Schema.DisplayType.Picklist) {
                List<Map<String, String>> picklistOptions = new List<Map<String, String>>();
                for (Schema.PicklistEntry picklistEntry : fieldDescribe.getPicklistValues()) {
                    picklistOptions.add(new Map<String, String>{'value' => picklistEntry.getValue(), 'label' => picklistEntry.getLabel()});
                }
                fieldInfo.put('picklistValues', picklistOptions);
            }
            
            fieldSetValues.add(fieldInfo);
        }
        
        return fieldSetValues;
    }
}