import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RestService } from '../rest.service';
@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.page.html',
    styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {
    
    public filter_data:{price_type:any,store_availability:any,brands:any,brand_list:any};
    public brand_list:any;
    public brand_list2:any;
    public is_sort_by:boolean = false;
    public is_availability:boolean = true;
    public is_brand:boolean = true;
    public selected_brands:any = [];
    public postable_data:any;
    public is_brand_api:boolean = false;
    public price_type:any = '';
    public store_availability:any = '';
    public brands:any = [];
    public category_id:number = null;
    constructor(
        private modalCtrl:ModalController,
        private rest: RestService
        ) { 
    }

    ngOnInit() {
        console.log("postable_data", this.postable_data);
        console.log("brand_list2", this.brand_list2);
        if(this.category_id != this.postable_data.category_id)
        {
            // this.clear_filter();
        }
        this.category_id = this.postable_data.category_id;
        this.price_type = this.postable_data.price_type;
        this.store_availability = this.postable_data.store_availability;
        this.brands = this.postable_data.brands;
        if(this.brand_list2 && this.brand_list2.length > 0)
        {
            this.brand_list = this.brand_list2;
            this.is_brand_api = true;
        }
    }

    close_modal(){

        this.filter_data = {price_type:this.price_type,store_availability:this.store_availability,brands:this.brands,brand_list:this.brand_list};
        this.modalCtrl.dismiss(this.filter_data);
        // this.clear_filter();
    }

    clear_filter()
    {
        this.price_type = null;
        this.store_availability = null;
        this.brands = null;
        // this.brand_list = null;
        this.brand_list.forEach((item, index) => {
            if (item.checked) {
                this.brand_list[index].checked = false;
            }
        });
        this.filter_data = {price_type:this.price_type,store_availability:this.store_availability,brands:this.brands,brand_list:this.brand_list};
        // this.close_modal(); no need to close model on reset filter
    }

    apply_filter()
    {
        this.filter_data = {price_type:this.price_type,store_availability:this.store_availability,brands:this.brands,brand_list:this.brand_list};
        this.close_modal();
    }

    load_brands() {
        this.is_sort_by=true;
        this.is_availability=true;
        this.is_brand=false;
        if(this.is_brand_api == false)
        {
            this.rest.present();
            this.rest.GlobalPHit(this.postable_data, 'User/get_brands').subscribe((result) => {
                this.rest.dismiss();
                this.is_brand_api = true;
                if (result.status == 1) {
                    this.brand_list = result.data;
                }
            }, (err) => {
                this.rest.dismiss();
                console.log(err);
            });
        }
    }

    select_brand(data) {
        if (data.checked == true) {
            this.selected_brands.push(data.brand_id);
        } else {
            let newArray = this.selected_brands.filter(function (el) {
                return el !== data.brand_id;
            });
            this.selected_brands = newArray;
        }
        // console.log(this.selected_brands);
        this.brands = this.selected_brands;
    }
}
