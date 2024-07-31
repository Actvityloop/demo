public with sharing class DynamicFormController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getObjectFields(String objectName) {
        List<Map<String, Object>> fieldList = new List<Map<String, Object>>();
        system.debug('objectName'+objectName);
        try {
            if (String.isNotBlank(objectName)) {
                Schema.DescribeSObjectResult objDescribe = Schema.getGlobalDescribe().get(objectName)?.getDescribe();
                if (objDescribe != null) {
                    Map<String, Schema.SObjectField> fields = objDescribe.fields.getMap();
                    for (String fieldName : fields.keySet()) {
                        Schema.DescribeFieldResult fieldDescribe = fields.get(fieldName).getDescribe();
                        Map<String, Object> fieldInfo = new Map<String, Object>{
                            'label' => fieldDescribe.getLabel(),
                            'name' => fieldDescribe.getName(),
                            'type' => fieldDescribe.getType().name()
                        };
                        fieldList.add(fieldInfo);
                    }
                } else {
                    throw new AuraHandledException('Object describe result is null for object: ' + objectName);
                }
            } else {
                throw new AuraHandledException('Object name is blank or null.');
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching fields: ' + e.getMessage());
        }
        return fieldList;
    }
}