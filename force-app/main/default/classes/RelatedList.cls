public with sharing class RelatedList {
 @AuraEnabled(cacheable=true)
    public static List<Opportunity> getRelatedListData(Id recordId) {
        System.debug('Record ID: ' + recordId); // Debug statement
        try {
            // Replace with appropriate query logic
            return [SELECT Id, Name, CloseDate, StageName 
                    FROM Opportunity 
                    WHERE AccountId = :recordId];
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage()); // Debug statement
            throw new AuraHandledException('Unable to fetch related data: ' + e.getMessage());
        }
    }
}