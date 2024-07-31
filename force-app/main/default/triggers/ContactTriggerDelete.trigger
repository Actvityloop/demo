trigger ContactTriggerDelete on Contact (before insert,before update, after insert, after update,after delete,after undelete) 
{ 
    Set<id> accountids= new Set<id>();
    
    if(Trigger.isBefore)
    {
        for(Contact con: trigger.new){
            if(con.AccountId !=null &&(Trigger.isInsert ||(Trigger.isUpdate && Trigger.oldMap.get(con.id).AccountId !=con.AccountID))){
                accountids.add(con.accountid);
            }
        }
        
    }
    
    if(Trigger.isAfter){
        if(trigger.isinsert || trigger.isupdate){
            if(!accountids.isEmpty()){
               updateAccountContactCounts(accountids); 
            }
        }
    }else if(Trigger.isDelete){
        handleDeletedContacts(Trigger.oldmap.keyset());
    }else if(Trigger.isundelete){
        handleunDeletedContacts(trigger.newmap.Keyset());
    }
    
    private void updateAccountContactCounts(set<Id> accountids)
    {
        List<Account> accountsToUpdate = new List<Account>();
        List<Account> accountlist = [Select id ,name,Number_of_Contacts__c,(Select Id,name from contacts) from Account where ID IN:accountids];
        for(Account acc : accountlist ){
             Integer newContactCount = acc.Contacts.size();
            if(newContactCount!=acc.Number_of_Contacts__c){
              acc.Number_of_Contacts__c = newContactCount; 
                accountsToUpdate.add(acc);
            }
        }
        if(!accountsToUpdate.isEmpty()){
            Update accountsToUpdate;
        }
    }
    private void handleDeletedContacts(Set<Id> deletedContactIds)
    {
        Set<Id> setaccountrecords = new Set<Id>();
        List<Contact> conlist=[Select Id, Name,Accountid  from Contact Where ID IN:deletedContactIds];
        for(contact con:conlist)
        {
            if(con.AccountId!=null){
                setaccountrecords.add(con.AccountId);
            }
        }
        
        List<Account> accountlist =[Select id, Name,Number_of_Contacts__c,(Select id from Contacts) from Account Where ID IN:setaccountrecords];
        List<Account> accountsToUpdate = new List<Account>();
        for(Account acc : accountlist){
            Integer newContactCount = acc.contacts.size()-deletedContactIds.size();
            acc.Number_of_Contacts__c = Math.max(newContactCount, 0); // Ensure count doesn't go below zero
            
        }
        if(!accountlist.isEmpty()){
            update accountlist;
        }
    }
    private void handleUndeletedContacts(Set<Id> undeletedContactIds) {
    // Gather Account IDs from undeleted Contacts
    Set<Id> accountIds = new Set<Id>();
    for (Contact con : [SELECT AccountId FROM Contact WHERE Id IN :undeletedContactIds]) {
        if (con.AccountId != null) {
            accountIds.add(con.AccountId);
        }
    }

    if (!accountIds.isEmpty()) {
        List<Account> accountsToUpdate = [SELECT Id, Number_of_Contacts__c, (SELECT Id FROM Contacts) 
                                          FROM Account WHERE Id IN :accountIds];
        
        for (Account acc : accountsToUpdate) {
            Integer newContactCount = acc.Contacts.size() + undeletedContactIds.size();
            acc.Number_of_Contacts__c = newContactCount; // Increase count by the number of undeleted contacts
        }
        
        if (!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
}
}