public with sharing class FieldSetController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getFieldSetValues() {
        List<Map<String, Object>> fieldSetValues = new List<Map<String, Object>>();
        Schema.SObjectType sObjectType = Schema.getGlobalDescribe().get('Salesforce_Objectss__c'); // Update to your actual SObject API name
        Schema.DescribeSObjectResult describeSObjectResult = sObjectType.getDescribe();
        Schema.FieldSet fieldSet = describeSObjectResult.fieldSets.getMap().get('fecth_salesforce_fileds'); // Update to your actual Field Set name

        for (Schema.FieldSetMember fieldSetMember : fieldSet.getFields()) {
            Map<String, Object> fieldInfo = new Map<String, Object>();
            String fieldPath = fieldSetMember.getFieldPath();
            fieldInfo.put('label', fieldSetMember.getLabel());
            fieldInfo.put('fieldName', fieldPath);
            
            // Get the field describe result
            Schema.DescribeFieldResult fieldDescribe = fieldPath.split('\\.').size() > 1 ? 
                describeSObjectResult.fields.getMap().get(fieldPath.split('\\.')[1]).getDescribe() : 
                describeSObjectResult.fields.getMap().get(fieldPath).getDescribe();
            
            // Initialize the field type variable
            String fieldType = fieldDescribe.getType().name();

            // Handle different field types
            if (fieldDescribe.getType() == Schema.DisplayType.Picklist) {
                List<Map<String, String>> picklistOptions = new List<Map<String, String>>();
                for (Schema.PicklistEntry picklistEntry : fieldDescribe.getPicklistValues()) {
                    picklistOptions.add(new Map<String, String>{'value' => picklistEntry.getValue(), 'label' => picklistEntry.getLabel()});
                }
                fieldInfo.put('type', 'Picklist');
                fieldInfo.put('picklistValues', picklistOptions);
            } else if (fieldDescribe.getType() == Schema.DisplayType.MultiPicklist) {
                List<Map<String, String>> multiPicklistOptions = new List<Map<String, String>>();
                for (Schema.PicklistEntry picklistEntry : fieldDescribe.getPicklistValues()) {
                    multiPicklistOptions.add(new Map<String, String>{'value' => picklistEntry.getValue(), 'label' => picklistEntry.getLabel()});
                }
                fieldInfo.put('type', 'MultiPicklist');
                fieldInfo.put('multiPicklistValues', multiPicklistOptions);
            } else if (fieldDescribe.getType() == Schema.DisplayType.Textarea) {
                fieldInfo.put('type', 'Textarea');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Boolean) {
                fieldInfo.put('type', 'Checkbox');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Percent) {
                fieldInfo.put('type', 'Percent');
            } else if (fieldDescribe.getType() == Schema.DisplayType.String) {
                fieldInfo.put('type', 'Text');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Integer) {
                fieldInfo.put('type', 'Number');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Phone) {
                fieldInfo.put('type', 'Phone');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Email) {
                fieldInfo.put('type', 'Email');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Date) {
                fieldInfo.put('type', 'Date');
            } else if (fieldDescribe.getType() == Schema.DisplayType.DateTime) {
                fieldInfo.put('type', 'DateTime');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Currency) {
                fieldInfo.put('type', 'Currency');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Time) {
                fieldInfo.put('type', 'Time');
            } else if (fieldDescribe.getType() == Schema.DisplayType.Url) {
                fieldInfo.put('type', 'URL');
            } else {
                fieldInfo.put('type', fieldType);
            }

            fieldSetValues.add(fieldInfo);
        }
        
        return fieldSetValues;
    }

    @AuraEnabled
    public static void saveFieldSetValues(List<SectionWrapper> sections) {
        List<Salesforce_Objectss__c> recordsToUpdate = new List<Salesforce_Objectss__c>();
        
        for (SectionWrapper section : sections) {
            Salesforce_Objectss__c record = new Salesforce_Objectss__c();
            
            for (Map<String, Object> field : section.fieldSetValues) {
                String fieldName = (String) field.get('fieldName');
                Object fieldValue = field.get('value');
                
                // Map the field values to the record
                record.put(fieldName, fieldValue);
            }
            
            recordsToUpdate.add(record);
        }

        try {
            // Insert or update records in Salesforce
            upsert recordsToUpdate;
        } catch (DmlException e) {
            // Handle DML exceptions
            System.debug('An error occurred while saving records: ' + e.getMessage());
            throw new AuraHandledException('An error occurred while saving records: ' + e.getMessage());
        }
    }

    public class SectionWrapper {
        @AuraEnabled public List<Map<String, Object>> fieldSetValues { get; set; }
    }
}