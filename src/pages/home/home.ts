import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import Chart from 'chart.js';
import { AdMobFree, AdMobFreeInterstitialConfig, AdMobFreeBannerConfig } from '@ionic-native/admob-free';
import { ModalPage } from '../modal/modal';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  startValue: number;
  monthlySavings: number;
  interest: number;
  numberOfYears: number;
  totalAmount: number;
  numberOfMonths: number;



  numberOfYearsCeiling: number;
  androidId = 'ca-app-pub-3216935214507444/8442350006';
  interstitialId= 'ca-app-pub-3216935214507444/4918462996'; 

  // androidId=  'ca-app-pub-3940256099942544/6300978111'; //google test
  // interstitialId= 'ca-app-pub-3940256099942544/1033173712'; //google test


  graphData: any[] = [];
  graphYears: any[] = [];

  timesCalculated : number = 0;

  isCalculating: boolean = false;

  modal : any;
  constructor(public navCtrl: NavController, public adMobFree: AdMobFree, public modalCtrl: ModalController) {
    this.modal = this.modalCtrl.create(ModalPage, {home: this} , {showBackdrop: true});
    

  }

  presentModal() {
    this.modal.present();
  }

  
  closeModal(){
    this.modal.dismiss();

  }


  ionViewDidEnter(){

    const bannerConfig : AdMobFreeBannerConfig = {
      id: this.androidId,
      isTesting : false,
      autoShow : true
  
    }

    this.adMobFree.banner.config(bannerConfig);

    this.adMobFree.banner.prepare().then(() => {
      // this.adMobFree.banner.show();

    }).catch(e => console.log(e));

    // this.initiateInterstitialAd();

  }
  
initiateInterstitialAd(){
  
  const interstitialConfig : AdMobFreeInterstitialConfig = {
    id: this.interstitialId,
    isTesting : false,
    autoShow : false

  }

  this.adMobFree.interstitial.config(interstitialConfig);

  this.adMobFree.interstitial.prepare().then(() => {

  }).catch(e => console.log(e));



}

  calculate() {
    var totalFromStartValue = this.startValue * (Math.pow( 1+ ( this.interest/100 ), this.numberOfYears ));
    
    var totalFromMonthlySavings = (this.monthlySavings * 12) * (Math.pow(1+(this.interest/100),5)-1)/(this.interest/100);

    this.totalAmount = Math.round(totalFromStartValue + totalFromMonthlySavings); 
  }

  calculateTotalAmountFromValues(numberOfYears)
  {
    var startValue = this.startValue;
    var interest = this.interest;
    if(this.startValue === 0 || this.startValue === undefined)
      startValue = 1

      if(this.interest === undefined)
      interest = 0

    var calculatedInterestForStartValue = interest === 0 ? 1 * numberOfYears : (Math.pow( 1+ ( interest/100 ), numberOfYears )); 

    var totalFromStartValue = startValue * calculatedInterestForStartValue;
    
    var calculatedInterestForMonthlySavings = interest === 0 ? 1 * numberOfYears :(Math.pow(1+(interest/100),numberOfYears)-1)/(interest/100);

    var totalFromMonthlySavings = (this.monthlySavings * 12) * calculatedInterestForMonthlySavings;



    return Math.round(totalFromStartValue + totalFromMonthlySavings); 

  }

  // showAdd(){
  //   this.initiateInterstitialAd();
  //   if(this.adMobFree.interstitial.isReady())
  //   {
  //     this.adMobFree.interstitial.show();

  //   }

  // }


  calculateNumberOfYears(){
  
    if (this.monthlySavings < 100 ||this.monthlySavings === undefined)
    {
      this.presentModal();
      return;
    }
      

    document.getElementById("dollar").className = 'hide';

    var startValue = this.startValue;
    var interest = this.interest;
    
    if(this.startValue === 0 || this.startValue === undefined)
    {
      startValue = 1
      this.startValue = 0
    }
    

    if(this.interest === undefined || this.interest === 0 || this.interest < 0)
      interest = 0

    if(interest > 0)
    {

        var convertedStartValue = startValue * (interest/100) + (this.monthlySavings * 12);
    
        var convertedMillion = 1000000 * (interest/100) + (this.monthlySavings * 12);
    
        var years = (Math.log(convertedMillion/convertedStartValue)/(Math.log(1+(interest/100))));
    
        this.numberOfYears = Math.floor(years)
        
        this.numberOfMonths = Math.round((years%1)*12);
    
        this.numberOfYearsCeiling = Math.ceil(years);
        
    }
    else{

      var years2 = (1000000 - this.startValue)/(this.monthlySavings*12);
      this.numberOfYears = Math.floor(years2) 
      this.numberOfMonths = Math.round((years2%1)*12);
  
      this.numberOfYearsCeiling = Math.ceil(years2);
      

    }
      

    this.buildData();  
    this.createChart();

    document.getElementById("total").className='visible';
  }

  buildData(){
    this.graphData = [];
    this.graphYears= [];


    this.timesCalculated = this.timesCalculated +1;

    if(this.timesCalculated % 3 == 0)
    {
      // this.showAdd();
    }

    for(var i=1; i <= this.numberOfYearsCeiling; i++)
    {
      this.graphData.push(this.calculateTotalAmountFromValues(i))
      this.graphYears.push(i);
    }
  }

  createChart(){
    this.isCalculating = false;


    // 125, 206, 160
    var ctx = document.getElementById("myChart");

    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.graphYears,
          datasets: [{
              label: 'Saved amount',
              data:this.graphData,
              
              borderWidth: 1,
              backgroundColor: ["rgb(125,206,160)"]
          }]
      },
      options: {
          scales: {
              yAxes: [{
                ticks: {
                      beginAtZero:false
                  },
                  
              }]
          }
      }

    });

    myChart.reset();

    myChart.update({
      duration: 3000,
      easing: 'easeOutBounce'
  })
  }



  
}
