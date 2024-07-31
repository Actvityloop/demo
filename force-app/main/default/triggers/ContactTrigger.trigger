trigger ContactTrigger on Contact (before insert,before update,after insert, after update) 
{
    Set<Id> contactids = new Set<ID>();
    if(trigger.isbefore){
        for(Contact con: trigger.new){
            if(con.accountid!=null &&(Trigger.isInsert || (Trigger.oldMap.get(con.id).Description != con.Description)))
            {
                contactids.add(Con.AccountId) ; 
            }
        }
    }
    
    if(Trigger.isAfter && !contactids.isEmpty())
    {
        updateAccountDescriptions(contactids);
    }
    
    private void  updateAccountDescriptions(Set<Id> Accountids)
    {
       
        List<Account> newaccounts =[Select Id, name,Description,(Select Id,name,Description from Contacts) From Account where ID=:contactids];
        List<Account> accountsToUpdate = new List<Account>();
      
        For(Account acc : newaccounts){
            string newdescrption ='';
            for(Contact con :acc.contacts ){
                newdescrption = con.Description;
            }
            if(newdescrption!=acc.Description){
                 acc.Description = newdescrption;
            accountsToUpdate.add(acc);
            }
            
        }
        if(!accountsToUpdate.isEmpty()) {
            update accountsToUpdate;
        }
    }
    
}