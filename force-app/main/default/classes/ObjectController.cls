public with sharing class ObjectController {
    @AuraEnabled(cacheable=true)
    public static List<String> getObjectList() {
        List<String> objectList = new List<String>();
        for (Schema.SObjectType objType : Schema.getGlobalDescribe().values()) {
            objectList.add(objType.getDescribe().getName());
        }
        return objectList;
    }

    @AuraEnabled(cacheable=true)
    public static List<FieldInfo> getObjectFields(String objectName) {
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
        List<FieldInfo> fieldInfoList = new List<FieldInfo>();

        for (Schema.SObjectField field : fieldMap.values()) {
            Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
            fieldInfoList.add(new FieldInfo(fieldDescribe.getName(), fieldDescribe.getLabel(), fieldDescribe.getType().name()));
        }

        return fieldInfoList;
    }
}