import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  startValue: number;
  monthlySavings: number;
  interest: number;
  numberOfYears: number = 0;
  totalAmount: number;
  numberOfMonths: number;
  constructor(public navCtrl: NavController) {

  }

  calculate(){
    // var interest = this.interest;

    var totalFromStartValue = this.startValue * (Math.pow( 1+ ( this.interest/100 ), this.numberOfYears ));
    
    var totalFromMonthlySavings = (this.monthlySavings * 12) * (Math.pow(1+(this.interest/100),5)-1)/(this.interest/100);

    // this.totalAmount = this.startValue * ( 1+ (this.interest*0.01))
    console.log(totalFromStartValue);
    console.log(totalFromMonthlySavings);

    this.totalAmount = Math.round(totalFromStartValue + totalFromMonthlySavings); 


  }

  calculateNumberOfYears(){
    var convertedStartValue = this.startValue * (this.interest/100) + (this.monthlySavings * 12);
    var convertedMillion = 1000000 * (this.interest/100) + (this.monthlySavings * 12);

    var years = (Math.log(convertedMillion/convertedStartValue)/(Math.log(1+(this.interest/100))));

    this.numberOfYears = Math.floor(years) 
    this.numberOfMonths = Math.round((years%1)*12);
  }

}
