import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-order-raise-ticket',
    templateUrl: './order-raise-ticket.page.html',
    styleUrls: ['./order-raise-ticket.page.scss'],
})
export class OrderRaiseTicketPage implements OnInit {
    @Input() PData: any = { apikey: this.rest.APIKey, user_id: '', store_id: '', ProductIssue: '', order_id: '', issue_type: '', selected_data: '', subject: '', description: '', image: '', ticket_id: '' };

    public PModel = {};
    public ServiceData;
    public DiliveryData;
    public MessageError;
    public ErrorProductIssue;
    public ErrorDescription;
    public ErrorSubject;
    public ErrorProductboth;

    constructor(private rest: RestService, private navCtrl: NavController, public storage: Storage, public alertController: AlertController,
        public router: ActivatedRoute) {

    }

    ngOnInit() {
        this.PData.order_id = this.router.snapshot.paramMap.get('orderID');
        this.storage.get('id').then((userid) => {
            this.PData.user_id = userid;
            if (userid != '' && userid != null) {
                this.chekBlock()
            }
            this.storage.get('storeID').then((storeID) => {
                this.PData.store_id = storeID;
                // this.PData['ProductIssue']="1";
                this.CheckDiliveryBoyOrNot();
            });
        });
    }

    chekBlock() {
        this.storage.get('id').then((val) => {
            let key = {
                "user_id": val,
                "apikey": this.PData.apikey
            }
            this.rest.userBlock(key).subscribe((result) => { });
        });
    }

    ListingHit() {
        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/get_data_by_issue_type').subscribe((result) => {
            this.ServiceData = result;
            if (this.ServiceData.status == 1) {

                let productData = this.ServiceData['data'];
                if (productData) {
                    this.PData['selected_data'] = this.ServiceData['data'][0]['id'];
                    console.log(JSON.stringify(this.PData['selected_data']) + '---->' + JSON.stringify(this.ServiceData['data'][0]['product_name']))
                } else {
                    this.PData['selected_data'] = this.ServiceData['delivery_boy_data']['first_name'] + ' ' + this.ServiceData['delivery_boy_data']['last_name'];
                }

            } else {
                this.ErrorAlert();

            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    CheckDiliveryBoyOrNot() {

        this.rest.present();
        this.rest.GlobalPHit(this.PData, 'User/my_ticket').subscribe((result) => {
            this.DiliveryData = result;
            if (this.DiliveryData.status == 1) {
                let ticket_view = this.DiliveryData['data']['ticket_view'];
                if (ticket_view) { this.PData.ticket_id = this.DiliveryData['data']['ticket_view']['id']; }

            } else {
                this.ErrorAlert();
            }
            this.rest.dismiss();
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    changeFirst() {
        if (this.PData['ProductIssue']) {
            this.ErrorProductIssue = "";
            this.PData.issue_type = this.PData['ProductIssue'];
            this.ListingHit();
        }
    }

    change() {

        if (this.PData['subject']) {
            this.ErrorSubject = "";
        }
        if (this.PData['description']) {
            this.ErrorDescription = "";
        }
    }

    ViewOrder(ticket_id) {
        this.navCtrl.navigateForward(["/view-ticket", { type: "order", ticket_id: ticket_id }]);
    }

    Submit() {

        var z = "";
        this.ErrorProductboth = "";
        if (!this.PData['ProductIssue']) {
            this.ErrorProductIssue = "Issue type must be required";
        }
        if (!this.PData['subject']) {
            this.ErrorSubject = " Subject must be required";
        }
        if (!this.PData['description']) {
            this.ErrorDescription = "Description must be required";
        }

        if (!this.PData['selected_data']) {
            this.ErrorProductboth = "This Field must be required";
        }

        this.PData.image = $("#uploaded_path_24").val();

        if (this.PData['ProductIssue'] && this.PData['subject'] && this.PData['description'] && this.PData['selected_data'] && z != '1') {
            //add_order_issue_ticket
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'User/add_order_issue_ticket').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                    this.ConfirmAlert();

                } else {
                    this.ErrorAlert();

                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }

    }

    ThreadSubmit() {
        if (!this.PData['description']) {
            this.ErrorDescription = "Description must be required";
        }
        if (this.PData['description']) {
            this.rest.present();
            this.rest.GlobalPHit(this.PData, 'User/create_thread').subscribe((result) => {
                this.ServiceData = result;
                if (this.ServiceData.status == 1) {
                    this.ConfirmAlert();

                } else {
                    this.ErrorAlert();
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    Cancel() {
        this.navCtrl.navigateBack('/order-list');
    }

    async ErrorAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: ['OK']
        });
        await alert.present();
    }

    async ConfirmAlert() {
        let alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: [
                {
                    text: 'OK',
                    role: 'OK',
                    handler: () => {
                        this.navCtrl.navigateForward(['order-issue', { chek: '1' }]);
                        console.log('OK clicked');
                    }
                }]
        });
        await alert.present();
    }

}
