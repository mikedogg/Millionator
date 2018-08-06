import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }
  
  closeModal()
  {
    let page = this.navParams.get("home");
    page.closeModal();
  }
}
