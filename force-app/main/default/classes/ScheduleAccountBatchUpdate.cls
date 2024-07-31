global class ScheduleAccountBatchUpdate implements Schedulable {
    
    global void execute(SchedulableContext sc){
        AccountUpdateBatchJob aa  = new AccountUpdateBatchJob();
        Database.executeBatch(aa,200);
    }

}