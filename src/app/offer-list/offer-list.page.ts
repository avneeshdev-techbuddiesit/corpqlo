import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-offer-list',
    templateUrl: './offer-list.page.html',
    styleUrls: ['./offer-list.page.scss'],
})
export class OfferListPage implements OnInit {

    public category_id;
    public category_name;
    public cat_name;
    public Listing;
    public subcat_name;
    public catmain_id;
    public ErrorMsg;

    constructor(private modalCtrl: ModalController) { }

    ngOnInit() {
        console.log("Listing--->" + JSON.stringify(this.Listing))
    }
    change(SbName, category_id, subcat_name, catmain_id) {
        console.log(category_id + "--subcat_name--->" + subcat_name);
        this.category_id = category_id;
        this.category_name = SbName;
        this.catmain_id = catmain_id;
        this.subcat_name = subcat_name;
    }

    close(arr = null) {
        this.modalCtrl.dismiss(arr);
    }
    submit() {
        if (this.subcat_name) {
            let arr = [];
            arr = [{
                SbName: this.category_name,
                category_id: this.category_id,
                catmain_id: this.catmain_id,
                subcat_name: this.subcat_name,

                // category_name: this.category_name,
                // category_id: this.category_id, 
                // cat_name: this.cat_name,
                // catmain_id:this.catmain_id,
                // subcat_name:this.subcat_name,
            }]
            this.close(arr);
            //this.Close();
            console.log(this.category_id + "subcat_name--->" + this.category_name)
        } else {
            this.ErrorMsg = "Select Offer Listing First !";
        }
    }

}
