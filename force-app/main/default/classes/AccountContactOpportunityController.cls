public with sharing class AccountContactOpportunityController 
{
    @AuraEnabled(Cacheable=true)
    public Static List<Account> getaccounts(){
        return[Select Id, Name,(Select Id,Name from Contacts),(Select Id,Name,StageName from Opportunities) from Account];
    }

}