global class AccountUpdateBatchJob implements Database.Batchable<sObject>
{
    global Database.QueryLocator start(Database.BatchableContext bc){
      String query = 'SELECT Id,Name FROM Account';
       
        return Database.getQueryLocator(query);
    }
   global void execute(Database.BatchableContext BC,List<Account> scope)  {
       
        for(Account acc : scope){
            acc.Name ='Batch Excuted';
        }
        update Scope;
        
    }
    
    global void finish(Database.BatchableContext bc){
        
    }

}