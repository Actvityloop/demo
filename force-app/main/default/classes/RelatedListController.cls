/*public with sharing class RelatedListController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getRelatedListData(Id recordId) {
        // Specify the Salesforce object name
        String objectName = 'Salesforce_Objectss__c'; // Replace with your Salesforce object API name
        List<String> fieldSetNames = new List<String>{'fecth_salesforce_fileds'}; // Example list of field set names

        // Initialize list to hold field paths dynamically
        List<String> fieldPaths = new List<String>();

        // Retrieve fields dynamically based on object describe
        try {
            // Retrieve object describe information
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
          
                Schema.DescribeSObjectResult objDescribe = globalDescribe.get(objectName).getDescribe();

                // Populate fieldPaths with fields from all field set names
               for(Schema.FieldSetMember fieldset : Schema.SObjectType.Salesforce_Objectss__c.FieldSets.fecth_salesforce_fileds.getFields()) {
                Map<String ,String> lableAPIMap = new Map<String ,String>();
                lableAPIMap.put(fieldset.getLabel(),fieldset.getFieldPath());
                fieldPaths.add(fieldset.getFieldPath());
            }
            
        } catch (Exception e) {
            // Handle any exceptions or null references
            System.debug('Error retrieving object describe information: ' + e.getMessage());
            return new List<Map<String, Object>>(); // Return empty list or handle gracefully
        }
         System.debug('fieldPaths');
        // Construct the dynamic SOQL query with selected fields
        String query = 'SELECT '+ String.join(fieldPaths, ', ') + ' FROM ' + objectName + ' WHERE Opportunity__c = :recordId';
        System.debug('query>>>>>>>>>>'+query);
        
        try {
            List<SObject> records = Database.query(query);
            
            // Convert SObjects to Map<String, Object> for dynamic LWC consumption
            List<Map<String, Object>> result = new List<Map<String, Object>>();
            for (SObject record : records) {
                Map<String, Object> recordMap = new Map<String, Object>();
                for (String field : fieldPaths) {
                    recordMap.put(field, record.get(field));
                }
                result.add(recordMap);
            }
            return result;
        } catch (Exception ex) {
            System.debug('Error executing query: ' + ex.getMessage());
            return new List<Map<String, Object>>(); // Return empty list or handle gracefully
        }
    }
}*/

/*
public with sharing class RelatedListController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getRelatedListData(Id recordId) {
        String objectName = 'Salesforce_Objectss__c'; // Replace with your Salesforce object API name
        List<String> fieldSetNames = new List<String>{'fecth_salesforce_fileds'}; // Example list of field set names

        List<String> fieldPaths = new List<String>();
        Map<String, String> fieldTypes = new Map<String, String>();

        try {
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
            Schema.DescribeSObjectResult objDescribe = globalDescribe.get(objectName).getDescribe();

            for (Schema.FieldSetMember fieldset : Schema.SObjectType.Salesforce_Objectss__c.FieldSets.fecth_salesforce_fileds.getFields()) {
                fieldPaths.add(fieldset.getFieldPath());
                fieldTypes.put(fieldset.getFieldPath(), fieldset.getType().name());
            }
        } catch (Exception e) {
            System.debug('Error retrieving object describe information: ' + e.getMessage());
            return new Map<String, Object>{ 'records' => new List<Map<String, Object>>(), 'fieldTypes' => fieldTypes };
        }

        String query = 'SELECT ' + String.join(fieldPaths, ', ') + ' FROM ' + objectName + ' WHERE Opportunity__c = :recordId';

        try {
            List<SObject> records = Database.query(query);
            List<Map<String, Object>> result = new List<Map<String, Object>>();
            for (SObject record : records) {
                Map<String, Object> recordMap = new Map<String, Object>();
                for (String field : fieldPaths) {
                    recordMap.put(field, record.get(field));
                }
                result.add(recordMap);
            }
            return new Map<String, Object>{ 'records' => result, 'fieldTypes' => fieldTypes };
        } catch (Exception ex) {
            System.debug('Error executing query: ' + ex.getMessage());
            return new Map<String, Object>{ 'records' => new List<Map<String, Object>>(), 'fieldTypes' => fieldTypes };
        }
    }
}*/
public with sharing class RelatedListController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getRelatedListData(Id recordId) {
        String objectName = 'Salesforce_Objectss__c'; // Replace with your Salesforce object API name
        List<String> fieldSetNames = new List<String>{'fecth_salesforce_fileds'}; // Example list of field set names

        List<String> fieldPaths = new List<String>();
        Map<String, String> fieldTypes = new Map<String, String>();
        Map<String, List<String>> picklistValues = new Map<String, List<String>>();

        try {
            Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
            Schema.DescribeSObjectResult objDescribe = globalDescribe.get(objectName).getDescribe();

            for (Schema.FieldSetMember fieldset : Schema.SObjectType.Salesforce_Objectss__c.FieldSets.fecth_salesforce_fileds.getFields()) {
                String fieldPath = fieldset.getFieldPath();
                Schema.SObjectField fieldToken = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get(fieldPath);
                Schema.DescribeFieldResult fieldDescribe = fieldToken.getDescribe();

                fieldPaths.add(fieldPath);
                fieldTypes.put(fieldPath, fieldDescribe.getType().name());

                if (fieldDescribe.getType() == Schema.DisplayType.Picklist || fieldDescribe.getType() == Schema.DisplayType.MultiPicklist) {
                    List<String> values = new List<String>();
                    for (Schema.PicklistEntry entry : fieldDescribe.getPicklistValues()) {
                        values.add(entry.getLabel());
                    }
                    picklistValues.put(fieldPath, values);
                }
            }
        } catch (Exception e) {
            System.debug('Error retrieving object describe information: ' + e.getMessage());
            return new Map<String, Object>{
                'records' => new List<Map<String, Object>>(),
                'fieldTypes' => fieldTypes,
                'picklistValues' => picklistValues
            };
        }

        String query = 'SELECT ' + String.join(fieldPaths, ', ') + ' FROM ' + objectName + ' WHERE Opportunity__c = :recordId';

        try {
            List<SObject> records = Database.query(query);
            List<Map<String, Object>> result = new List<Map<String, Object>>();
            for (SObject record : records) {
                Map<String, Object> recordMap = new Map<String, Object>();
                for (String field : fieldPaths) {
                    recordMap.put(field, record.get(field));
                }
                result.add(recordMap);
            }
            return new Map<String, Object>{
                'records' => result,
                'fieldTypes' => fieldTypes,
                'picklistValues' => picklistValues
            };
        } catch (Exception ex) {
            System.debug('Error executing query: ' + ex.getMessage());
            return new Map<String, Object>{
                'records' => new List<Map<String, Object>>(),
                'fieldTypes' => fieldTypes,
                'picklistValues' => picklistValues
            };
        }
    }
}