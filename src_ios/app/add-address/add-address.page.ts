import { Component, OnInit, Input, NgZone } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { RestService } from '../rest.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { NgxSpinnerService } from "ngx-spinner";
import * as $ from 'jquery';
declare var google: any;

@Component({
    selector: 'app-add-address',
    templateUrl: './add-address.page.html',
    styleUrls: ['./add-address.page.scss'],
})
export class AddAddressPage implements OnInit {

    @Input() PData = {
        apikey: this.rest.APIKey, first_name: '', mobile_number: '', address: '', locality: '', land_mark: '',
        pincode: '', state_id: '', city: '', google_address: '', addr_type: '', user_id: '', store_id: '', Flat: '', colony: '', address_id: '',login_mobile: '', coards: "28.5890771,77.30677079999998"
        
    };

    public ErrorCity: any;
    public ErrorName: any;
    public ErrorMobile: any;
    public ErrorFlat: any;
    public ErrorColony: any;
    public Errorlandmark: any;
    public Errorlocate: any;
    public ErrorPincode: any;
    public ErrorState: any;
    public userid: any;
    public ServiceData: any;
    public homes;
    public offices;
    public others;
    public stattelist;
    public type = "Add";
    public lat;
    public lng;
    public selectedPlace;
    public storeID;
    public backto:string;
    public userLocation:any;
    geoLatitude: number;
    geoLongitude: number;
    geoAccuracy: number;
    geoAddress: string;
    watchLocationUpdates: any;
    loading: any;
    isWatching: boolean;
    geoencoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    GoogleAutocomplete;
    autocomplete;
    autocompleteItems;


    constructor(
        private rest: RestService,
        private navCtrl: NavController,
        public storage: Storage,
        public alertController: AlertController,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        private zone: NgZone,
        private spinner: NgxSpinnerService
    ) {
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = { input: '' };
        this.autocompleteItems = [];
    }
    

    ngOnInit() {
        this.get_state_list();
        
        this.storage.get('mobile').then((mobile) => {
            this.PData.login_mobile =  mobile;
          })
        this.backto = this.activatedRoute.snapshot.paramMap.get('backto');
        this.PData.addr_type = this.activatedRoute.snapshot.paramMap.get('address_type');
        this.PData.address_id = this.activatedRoute.snapshot.paramMap.get('address_id');
        this.storage.get('storeID').then((storeID) => {
            this.PData.store_id = storeID;
            this.storeID = storeID;
            this.storage.get('id').then((save_user_id) => {
                this.userid = save_user_id;
                this.PData.user_id = save_user_id;
                if (this.PData.address_id) {
                    this.type = "Edit";
                    this.get_address();
                }
            });
        });
        
    }
      

    get_address() {
        this.rest.present();
        this.PData.user_id = this.userid;
        this.rest.GlobalPHit(this.PData, 'My_account/my_address').subscribe((result) => {
            this.ServiceData = result;
            this.rest.dismiss();
            if (this.ServiceData.status == 1) {
                if (this.PData.addr_type == "home") {
                    this.homes = this.ServiceData.data.home;
                    this.PData.first_name = this.homes.first_name;
                    this.PData.mobile_number = this.homes.mobile_number;
                    this.PData.land_mark = this.homes.land_mark;
                    this.PData.address = this.homes.address;
                    this.PData.coards = this.homes.coards;
                    this.autocomplete.input = this.homes.google_address;
                    this.PData.Flat = this.homes.address;
                    this.PData.colony = this.homes.locality;
                    if (this.homes.pincode && this.homes.pincode != '0') {
                        this.PData.pincode = this.homes.pincode;
                    }
                    this.PData.state_id = this.homes.state_id;
                    this.PData.land_mark = this.homes.land_mark;
                    this.PData.city = this.homes.city;
                    $(".iframe_div").html('');
                    var srcs = "<iframe width='100%' id='namedd' src='https://maps.google.com/maps?q=" + this.PData.coards + "&hl=en&z=14&amp;output=embed' frameborder='0' style='border:0;' ></iframe>";
                    $(".iframe_div").html(srcs);
                }

                if (this.PData.addr_type == "office") {
                    this.homes = this.ServiceData.data.office;
                    this.PData.first_name = this.homes.first_name;
                    this.PData.mobile_number = this.homes.mobile_number;
                    this.PData.land_mark = this.homes.land_mark;
                    this.PData.coards = this.homes.coards;
                    this.PData.address = this.homes.address;
                    this.PData.Flat = this.homes.address;
                    this.autocomplete.input = this.homes.google_address;
                    this.PData.colony = this.homes.locality;
                    if (this.homes.pincode && this.homes.pincode != '0') {
                        this.PData.pincode = this.homes.pincode;
                    }
                    this.PData.state_id = this.homes.state_id;
                    this.PData.land_mark = this.homes.land_mark;
                    this.PData.city = this.homes.city;
                    $(".iframe_div").html('');
                    var srcs = "<iframe width='100%' id='namedd' src='https://maps.google.com/maps?q=" + this.PData.coards + "&hl=en&z=14&amp;output=embed' frameborder='0' style='border:0;' ></iframe>";
                    $(".iframe_div").html(srcs);
                }
                if (this.PData.addr_type == "other") {
                    this.homes = this.ServiceData.data.other;
                    this.PData.first_name = this.homes.first_name;
                    this.PData.mobile_number = this.homes.mobile_number;
                    this.PData.address = this.homes.address;
                    this.PData.coards = this.homes.coards;
                    this.PData.Flat = this.homes.address;
                    this.autocomplete.input = this.homes.google_address;
                    this.PData.colony = this.homes.locality;
                    if (this.homes.pincode && this.homes.pincode != '0') {
                        this.PData.pincode = this.homes.pincode;
                    }
                    this.PData.state_id = this.homes.state_id;
                    this.PData.land_mark = this.homes.land_mark;
                    this.PData.city = this.homes.city;
                    $(".iframe_div").html('');
                    var srcs = "<iframe width='100%' id='namedd' src='https://maps.google.com/maps?q=" + this.PData.coards + "&hl=en&z=14&amp;output=embed' frameborder='0' style='border:0;' ></iframe>";
                    $(".iframe_div").html(srcs);
                }
            } else {
                this.rest.showAlert(result.message)
                this.rest.dismiss();
            }
        }, (err) => {
            this.rest.dismiss();
            console.log(err);
        });
    }

    async SuccessAlert() {
        const alert = await this.alertController.create({
            message: this.ServiceData['message'],
            buttons: [{
                text: "OK",
                handler: () => {
                    if (this.storeID == 0) { 
                        this.navCtrl.navigateForward('add-address') 
                    } else {

                    }
                }
            }]
        });
        await alert.present();
    }

    ChangeMobile() {

        if (this.PData.mobile_number.toString().length >= 10) {
            this.ErrorMobile = "";
        }
        if (!this.PData.mobile_number || this.PData.mobile_number.toString().length < 10) {
            this.ErrorMobile = "Mobile number should be 10 numbers";
        }
    }

    get_state_list() {
        this.rest.GlobalPHit(this.PData, 'v2/User/get_states').subscribe((result) => {
            if (result.status == 1) {
                this.PData.state_id = '5';
                this.stattelist = result.data;
            
            }
        }, (err) => {
            console.log(err);
        });
   
    }


    get_my_location() {
        // alert('hello');
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
			this.lng = resp.coords.longitude;
			this.PData.coards = this.lat + ',' + this.lng;
        // alert(resp);
        this.rest.GlobalPHit(this.PData, 'v2/User/get_states').subscribe((result) => {
            if (result.status == 1) {
                this.PData.state_id = '5';
                this.stattelist = result.data;
                this.userLocation = result.address;
                // console.log(this.userLocation);
                $(".iframe_div").html('');
                var srcs = "<iframe width='100%' id='namedd' src='https://maps.google.com/maps?q=" + this.PData.coards + "&hl=en&z=14&amp;output=embed' frameborder='0' style='border:0;' ></iframe>";
                $(".iframe_div").html(srcs);
            }
        }, (err) => {
            console.log(err);
        });
    }).catch((error) => {
        console.log('Error getting location', error);
    });
    }

    UpdateGooglePlace() {

        // console.log("HELLO");
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }

        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
            (predictions, status) => {
                this.autocompleteItems = [];
                this.zone.run(() => {
                    predictions.forEach((prediction) => {
                        this.autocompleteItems.push(prediction);
                    });
                });
            });
    }

    SelectGooglePlace(item) {

        var geocoder = new google.maps.Geocoder();
        this.PData.address = item.description;
        this.autocomplete.input = item.description;
        this.autocompleteItems = [];
        geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
            if (results[0]['place_id'] || JSON.stringify(status) == 'OK') {
                this.lat = results[0]['geometry']['location'].lat();
                this.lng = results[0]['geometry']['location'].lng();
            }
            this.PData.coards = this.lat + ',' + this.lng;
            $(".iframe_div").html('');
            var srcs = "<iframe width='100%' id='namedd' src='https://maps.google.com/maps?q=" + this.PData.coards + "&hl=en&z=14&amp;output=embed' frameborder='0' style='border:0;' ></iframe>";
            $(".iframe_div").html(srcs);
        })
    }

    add_address() {
        this.ErrorCity = "";
        this.ErrorName = "";
        this.ErrorMobile = "";
        this.ErrorFlat = "";
        this.ErrorColony = "";
        this.Errorlandmark = "";
        this.ErrorPincode = "";
        this.ErrorState = "";
        this.Errorlocate = "";
        var z = 0;
        if (!this.PData.first_name) {
            z = 1;
            this.ErrorName = "Full Name Field Is Required !";
        }
        if (!this.PData.mobile_number) {
            z = 1;
            this.ErrorMobile = "Mobile Field Is Required !";
        }
        if (this.PData.mobile_number.toString().length < 10) {
            z = 1;
            this.ErrorMobile = "Mobile number should be 10 numbers";
        }
        if (!this.PData.land_mark) {
            z = 1;
            this.Errorlandmark = "Landmark Field is Required !";
        }
        if (!this.PData.pincode) {
            // z=1;
            // this.ErrorPincode="Pincode Field is Required !";
        }
        if (!this.autocomplete.input) {
            z = 1;
            this.Errorlocate = "Location Field Is Required !";
        }
        if (!this.PData.state_id) {
            // z=1;
            // this.ErrorState="State Field is Required !";
        }
        if (!this.PData.city) {
            // z=1;
            //  this.ErrorCity="City Field is Required !";
        }
        if (!this.PData.colony) {
            z = 1;
            this.ErrorColony = "The Address Field Is Required !";
        }
        if (!this.PData.Flat) {
            z = 1;
            this.ErrorFlat = "Flat Field Is Required !";
        }
        if (z == 0) {
            this.rest.present();
            this.PData.user_id = this.userid;
            this.PData.address = this.PData.Flat;
            this.PData.google_address = this.autocomplete.input;
            this.PData.locality = this.PData.colony;
            this.rest.GlobalPHit(this.PData, 'My_account/add_address').subscribe((result) => {
                
                this.ServiceData = result;
                if (result.status == 1) {
                    this.rest.showAlert(result.message)
                    if(this.backto)
                    {
                        this.navCtrl.navigateBack([this.backto, {refresh:1}]);
                    }
                    else{

                        this.navCtrl.navigateBack("/my-address");
                    }
                } else {
                    this.rest.showAlert(result.message)
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    edit_address() {

        this.ErrorCity = "";
        this.ErrorName = "";
        this.ErrorMobile = "";
        this.ErrorFlat = "";
        this.ErrorColony = "";
        this.Errorlandmark = "";
        this.Errorlocate = "";
        this.ErrorPincode = "";
        this.ErrorState = "";
        var z = 0;
        if (!this.PData.first_name) {
            z = 1;
            this.ErrorName = "Full Name Field Is Required";
        }
        if (!this.PData.mobile_number) {
            z = 1;
            this.ErrorMobile = "Mobile Field Is Required";
        }
        if (this.PData.mobile_number.length < 10) {
            z = 1;
            this.ErrorMobile = "Mobile number should be 10 number";
        }
        if (!this.PData.land_mark) {
            z = 1;
            this.Errorlandmark = "Landmark Field Is Required";
        }
        if (!this.PData.pincode) {
            //z=1;
            // this.ErrorPincode="Pincode Field is Required !";
        }
        if (!this.PData.state_id) {
            // z=1;
            //  this.ErrorState="State Field is Required !";
        }
        if (!this.PData.city) {
            // z=1;
            // this.ErrorCity="City Field is Required !";
        }
        if (!this.PData.colony) {
            z = 1;
            this.ErrorColony = "The Address Field Is Required";
        }
        if (!this.PData.Flat) {
            z = 1;
            this.ErrorFlat = "Flat Field Is Required";
        }
        if (z == 0) {

            this.rest.present();
            this.PData.user_id = this.userid;
            this.PData.address = this.PData.Flat;
            this.PData.google_address = this.autocomplete.input;
            this.PData.locality = this.PData.colony;
            this.rest.GlobalPHit(this.PData, 'My_account/edit_address').subscribe((result) => {
                this.ServiceData = result;

                if (result.status == 1) {
                    this.rest.showAlert(result.message)
                    if(this.backto)
                    {
                        this.navCtrl.navigateBack([this.backto, {refresh:1}]);
                    }
                    else{

                        this.navCtrl.navigateBack("/my-address");
                    }
                } else {
                    this.rest.showAlert(result.message)
                }
                this.rest.dismiss();
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    // get_user_position()
    // {
	// 	//this.spinner.show();
    //     this.geolocation.getCurrentPosition().then((resp) => {
    //         this.lat = resp.coords.latitude;
	// 		this.lng = resp.coords.longitude;
			
    //         this.PData.coards = this.lat + ',' + this.lng;
    //         console.log(this.PData.coards);
    //         $(".iframe_div").html('');
    //         var srcs = "<iframe width='100%' id='namedd' src='https://maps.google.com/maps?q=" + this.PData.coards + "&hl=en&z=14&amp;output=embed' frameborder='0' style='border:0;' ></iframe>";
    //         $(".iframe_div").html(srcs);
    //     }, (ErrorCode) => {
    //        console.log("get_user_position",ErrorCode);
            
    //     });
    // }
    keyPressAlbet(event) {

        var inp = String.fromCharCode(event.keyCode);
    
        if (/^[a-zA-Z\s]*$/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
}
