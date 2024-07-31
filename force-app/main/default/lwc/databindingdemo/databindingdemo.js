import { LightningElement,track } from 'lwc';
import {sum} from './util';

// if we sue the Export deafult use like this
//import firstname from './util';

// Common Componest are other componest calling methos:

import {oodoreven} from'c/myutil'

export default class Databindingdemo extends LightningElement {

    fruits =['Apple','Orange','Mango','Grapes'];
    handleclick2(event){
      alert(oodoreven(5));
     alert( sum(10,20));
     alert(firstname);
     
    }
    
  /* employee =[
      {
        name:'Juturu viyakumar',
        city : 'Chennai'
      },
      {
        name:'Juturu Rajasekar',
        city : 'Guduru'
      },
      {
        name:'Juturu Nirmala',
        city : 'Nellore'
      }
   ]
*/

 /*firstname='Juturu';
 expression1 = false;
 handleclick2(){
    this.expression1=!this.expression1;
 }
    */
 /* 
  @track person =['Jhon',2000];

  employee={
      name:"Juturrusiva",
      position :"Developer"
  }
    handleclick(event){
        if(event.target.name =="btn1"){
            this.firstname="JsK";
        } else if(event.target.name =="btn2")
        {
            this.firstname="JsKSR";
        }
        
    }
    handleclick2(){
        //this.person[0]='Mathew';
        this.firstname='Sivakumar';
        this.employee.position = "Lead Salesforce";
    }
    get personname(){
        return this.person[0];
    }
    */
}