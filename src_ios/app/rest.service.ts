import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LoadingController, AlertController, Events, NavController, Platform, ToastController } from '@ionic/angular';
//import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
@Injectable({
    providedIn: 'root'
})
export class RestService {

    public endpoint;
    public httpOptions;

    readonly APIKey = 'fng_L51r14yui3ertjui7f567';
    readonly domain = 'https://www.freshngreen.online/';
    readonly cdn_base_url = 'https://cdn.freshngreen.online/';
    //readonly domain             = 'http://localhost/freshgreen/';
    //readonly cdn_base_url       = 'http://localhost/freshgreen/';
    readonly BaseUrl = this.domain + 'API/';
    readonly cdn_assets_url = this.cdn_base_url + 'assets/';
    readonly cdn_upload_url = this.cdn_assets_url + 'uploads/';
    readonly cdn_product_compress_url = this.cdn_upload_url + 'product/compress/compress_';

    public loading: any;
    public isLoading = false;
    public _platform: string = 'android';
    public _app_name: string = 'Suncity';
    public _app_name_short: string = 'Suncity';
    public _currency: string = '₹';

    constructor(
        private http: HttpClient,
        public loadingCtrl: LoadingController,
        public alertController: AlertController,
        public storage: Storage,
        private navCtrl: NavController,
        private file: File,
        private transfer: FileTransfer,
        private platform: Platform,
        public events: Events,
        private toastCtrl: ToastController
    ) {
        // this.httpOptions = {
        //   headers: new HttpHeaders({
        //     'Content-Type':  'application/json'
        //   })
        // };
    }

    SignUp(product): Observable<any> {
        // console.log(product);
        return this.http.post<any>(this.BaseUrl + 'register_requestotp', JSON.stringify(product),).pipe(
            tap((product) => console.log('Rest Services SignUp -->' + product)),
            catchError(this.handleError<any>('SignUp'))
        );
    }
    SendOTP(product): Observable<any> {
        // console.log(product);
        return this.http.post<any>(this.BaseUrl + 'register', JSON.stringify(product),).pipe(
            tap((product) => console.log('Rest Services SendOTP -->' + product)),
            catchError(this.handleError<any>('SendOTP'))
        );
    }

    GlobalPHit(data, method): Observable<any> {
        // console.log(data, method);
        return this.http.post<any>(this.BaseUrl + method, JSON.stringify(data),).pipe(
            tap((data) => console.log('Rest Services GlobalPHit -->')
            ),
            catchError(this.handleError<any>('Login'))
        );
    }

    private handleError<T>(operation = 'operation', result?: T) {

        return (error: any): Observable<T> => {
            this.dismiss();
            // alert("Server error/Internet connectivity")
            console.error(error); // log to console instead
            console.log('Failed :: while hit service due to internet or server occurrence');
            return of(result as T);
        };
    }

    async present(message: string = 'Please wait...'): Promise<void> {
        this.isLoading = true;
        return await this.loadingCtrl.create({
            spinner: 'crescent',
            message: message,
            translucent: true,
            cssClass: 'mb-custom-class custom-loading',
            // duration: 40000,
        }).then(a => {
            a.present().then(() => {
                console.log('presented');
                if (!this.isLoading) {
                    a.dismiss().then(() => console.log('abort presenting'));
                }
            });
        });
    }

    async dismiss(): Promise<void> {
        this.isLoading = false;
        return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
    }

    async presentToast(messageText) {
        const toast = await this.toastCtrl.create({
            message: messageText,
            duration: 1000,
            cssClass: 'added-cart-alert-toast',
            position: 'bottom',
        });
        toast.present();
    }

    async presentToastTop(messageText) {
        const toast = await this.toastCtrl.create({
            message: messageText,
            duration: 1000,
            cssClass: 'added-cart-alert-toast1',
            position: 'top',
        });
        toast.present();
    }

    async presentToastBottom(messageText) {
        const toast = await this.toastCtrl.create({
            message: messageText,
            duration: 1000,
            cssClass: 'added-cart-alert-toast',
            position: 'bottom',
        });
        toast.present();
    }

    async presentToastTopFull(messageText) {
        const toast = await this.toastCtrl.create({
            message: messageText,
            duration: 1000,
            cssClass: 'alert-toast',
            position: 'top',
        });
        toast.present();
    }

    async presentToastBottomFull(messageText) {
        const toast = await this.toastCtrl.create({
            message: messageText,
            duration: 1000,
            cssClass: 'alert-toast',
            position: 'bottom',
        });
        toast.present();
    }

    async showAlert(error) {
        const alert = await this.alertController.create({
            message: error,
            buttons: ['OK']
        });
        await alert.present();
    }

    async showRouteAlert(message, url = null) {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: 'Attention',
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        if(url)
                        {
                            this.navCtrl.navigateForward(url);
                        }
                        // console.log('Confirm Okay');
                    }
                }
            ]
        });
        await alert.present();
    }

    userBlock(data) {
        return this.http.post<any>(this.BaseUrl + '/User/is_blocked_checked', JSON.stringify(data),).pipe(
            tap(async (data) => {
                if (data.status == 0) {
                    const alert = await this.alertController.create({
                        message: data.message,
                        backdropDismiss: false,
                        buttons: [
                            {
                                text: 'Ok',
                                role: 'Ok',
                                cssClass: 'secondary',
                                handler: (blah) => {
                                    this.storage.set('mobile', '');
                                    // this.user_id_login = "";
                                    this.storage.set('id', '');
                                    this.storage.set('user_name', '');
                                    this.storage.set('city', '');
                                    this.storage.set('country', '');
                                    this.storage.set('phone', '');
                                    this.storage.set('email_address', '');
                                    this.storage.set('address', '');
                                    this.storage.set('username', "");
                                    this.storage.set('last_name', "");
                                    this.storage.set('user_id', "");
                                    this.storage.set('gender', "");
                                    this.storage.set('user_all_data', "");
                                    this.events.publish('ProfileData', "");
                                    this.events.publish('Profileuser_pic', "");
                                    this.events.publish('Profileuser_name', "");
                                    this.navCtrl.navigateForward('/sign-in');
                                }
                            }
                        ],
                    });
                    await alert.present();
                }
            }),
            catchError(this.handleError<any>('Login'))
        );
    }

    save_image(url, event): Promise<any> {
        return Promise.resolve((() => {

            // temp solution
            // final_url = url;
            // console.log("load from url",final_url);
            // // return final_url;
            // event.path[0].src = final_url;
            // event.path[0].className = 'loaded';
            // return true;
            // temp solution
            var final_url;
            var file;
            var res = url.split("/");
            file = res[res.length - 1];
            if (url && file) {
                if (this.platform.is('cordova')) {
                    this.file.checkFile(this.file.dataDirectory, file).then(() => {
                        setTimeout(() => {
                            let win: any = window;
                            var myUrl = win.Ionic.WebView.convertFileSrc(this.file.dataDirectory + file);
                            final_url = myUrl;
                            final_url = final_url.replace('undefined', "http://localhost");
                            // return final_url;
                            if (this.platform.is('ios')) {
                                event.target.src = final_url;
                                event.target.className = 'loaded';
                            }
                            else {
                                event.target.src = final_url;
                                event.target.className = 'loaded';
                            }

                            console.log("load from localfile", final_url);
                        }, 100);
                    }, (error) => {
                        if (this.platform.is('ios')) {
                            event.target.src = url;
                            event.target.className = 'loaded';
                        }
                        else {
                            event.target.src = url;
                            event.target.className = 'loaded';
                        }

                        const fileTransfer: FileTransferObject = this.transfer.create();
                        fileTransfer.download(url, this.file.dataDirectory + file).then((entry) => {
                            setTimeout(() => {
                                let win: any = window;
                                // var myUrl = win.Ionic.WebView.convertFileSrc(this.file.dataDirectory + file);
                                // final_url = myUrl;
                                console.log('Download complete: ' + file);
                                // return final_url;
                            }, 100);
                        }, (error) => {
                            console.log("Download Error", error);
                            final_url = url;
                            // return final_url;
                            if (this.platform.is('ios')) {
                                event.target.src = final_url;
                                event.target.className = 'loaded';
                            } else {
                                event.target.src = final_url;
                                event.target.className = 'loaded';
                            }

                        });
                    });
                }
                else {
                    final_url = url;
                    console.log("load from url", final_url);
                    // return final_url;
                    event.target.src = final_url;
                    event.target.className = 'loaded';
                }
            }
        })());
    }

    async get_app_version() {
        const getVersionCode = 10005;
        this.GlobalPHit({ apikey: this.APIKey, type: 'android' }, 'app_version/get').subscribe((result) => {
            if (result.responseStatus == 'success' && result.responseCode == 200) {
                var latest_version = result.data.version_code;
                latest_version = parseInt(latest_version);
                if (latest_version && latest_version > getVersionCode) {

                    this.update_alert("New update available.");
                }
            }
        }, (err) => {
            console.log("get_app_version", err);
        });
    }

    async update_alert(message) {
        const alert = await this.alertController.create({
            header: "Update Information",
            cssClass: 'my-custom-class',
            message: message,
            animated: true,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Update',
                    role: 'Okay',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        this.update_alert("New update available.");
                        window.open('market://details?id=com.freshngreen.online', '_system', 'location=yes');
                    }
                }
            ]
        });
        await alert.present();
    }

    async noInternet(message = null) {
        const alert = await this.alertController.create({
            header: "No Internet",
            cssClass: 'my-custom-class',
            message: message,
            animated: true,
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Exit',
                    role: 'Okay',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        navigator['app'].exitApp();
                    }
                }
            ]
        });
        await alert.present();
    }

    multiSort(array, sortObject = {}) {
        const sortKeys = Object.keys(sortObject);

        // Return array if no sort object is supplied.
        // console.log("sortKeys", sortKeys);
        // console.log("sortKeys.length", sortKeys.length);
        if (!sortKeys.length) {
            return array;
        }

        // Change the values of the sortObject keys to -1, 0, or 1.
        for (let key in sortObject) {
            sortObject[key] = sortObject[key] === 'desc' || sortObject[key] === -1 ? -1 : (sortObject[key] === 'skip' || sortObject[key] === 0 ? 0 : 1);
        }

        const keySort = (a, b, direction) => {
            direction = direction !== null ? direction : 1;

            if (a === b) { // If the values are the same, do not switch positions.
                return 0;
            }

            // If b > a, multiply by -1 to get the reverse direction.
            return a > b ? direction : -1 * direction;
        };

        return array.sort((a, b) => {
            let sorted = 0;
            let index = 0;

            // Loop until sorted (-1 or 1) or until the sort keys have been processed.
            while (sorted === 0 && index < sortKeys.length) {
                const key = sortKeys[index];

                if (key) {
                    const direction = sortObject[key];

                    sorted = keySort(a[key], b[key], direction);
                    index++;
                }
            }

            return sorted;
        });
    }


}
