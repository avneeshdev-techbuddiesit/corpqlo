import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
    { path: 'category', loadChildren: './category/category.module#CategoryPageModule' },
    { path: 'my-account', loadChildren: './my-account/my-account.module#MyAccountPageModule' },
    { path: 'order-detail', loadChildren: './order-detail/order-detail.module#OrderDetailPageModule' },
    { path: 'order-list', loadChildren: './order-list/order-list.module#OrderListPageModule' },
    { path: 'product-view', loadChildren: './product-view/product-view.module#ProductViewPageModule' },
    { path: 'search', loadChildren: './search/search.module#SearchPageModule' },
    { path: 'subcategory', loadChildren: './subcategory/subcategory.module#SubcategoryPageModule' },
    { path: 'view-ticket', loadChildren: './view-ticket/view-ticket.module#ViewTicketPageModule' },
    { path: 'shopping-preferenes', loadChildren: './shopping-preferenes/shopping-preferenes.module#ShoppingPreferenesPageModule' },
    { path: 'add-preference', loadChildren: './add-preference/add-preference.module#AddPreferencePageModule' },
    { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsPageModule' },
    { path: 'offers', loadChildren: './offers/offers.module#OffersPageModule' },
    { path: 'wallet', loadChildren: './wallet/wallet.module#WalletPageModule' },
    { path: 'refer-freind', loadChildren: './refer-freind/refer-freind.module#ReferFreindPageModule' },
    { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
    { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpPageModule' },
    { path: 'new-password', loadChildren: './new-password/new-password.module#NewPasswordPageModule' },
    { path: 'otp', loadChildren: './otp/otp.module#OtpPageModule' },
    { path: 'sign-in', loadChildren: './sign-in/sign-in.module#SignInPageModule' },
    { path: 'enter-password', loadChildren: './enter-password/enter-password.module#EnterPasswordPageModule' },
    { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordPageModule' },
    { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
    { path: 'raise-ticket', loadChildren: './raise-ticket/raise-ticket.module#RaiseTicketPageModule' },
    { path: 'my-address', loadChildren: './my-address/my-address.module#MyAddressPageModule' },
    { path: 'add-address', loadChildren: './add-address/add-address.module#AddAddressPageModule' },
    { path: 'contact-us', loadChildren: './contact-us/contact-us.module#ContactUsPageModule' },
    { path: 'my-wishlist', loadChildren: './my-wishlist/my-wishlist.module#MyWishlistPageModule' },
    { path: 'select-ordertype', loadChildren: './select-ordertype/select-ordertype.module#SelectOrdertypePageModule' },
    { path: 'combo-details', loadChildren: './combo-details/combo-details.module#ComboDetailsPageModule' },
    { path: 'combo-listing', loadChildren: './combo-listing/combo-listing.module#ComboListingPageModule' },
    { path: 'mb-express', loadChildren: './mb-express/mb-express.module#MbExpressPageModule' },
    { path: 'loyalty-point', loadChildren: './loyalty-point/loyalty-point.module#LoyaltyPointPageModule' },
    { path: 'my-tickets', loadChildren: './my-tickets/my-tickets.module#MyTicketsPageModule' },
    { path: 'order-issue', loadChildren: './order-issue/order-issue.module#OrderIssuePageModule' },
    { path: 'store-issue', loadChildren: './store-issue/store-issue.module#StoreIssuePageModule' },
    { path: 'order-store-issue-view', loadChildren: './order-store-issue-view/order-store-issue-view.module#OrderStoreIssueViewPageModule' },
    { path: 'about-us', loadChildren: './about-us/about-us.module#AboutUsPageModule' },
    { path: 'wallet-addmoney', loadChildren: './wallet-addmoney/wallet-addmoney.module#WalletAddmoneyPageModule' },
    { path: 'order-raise-ticket', loadChildren: './order-raise-ticket/order-raise-ticket.module#OrderRaiseTicketPageModule' },
    { path: 'order-cancel', loadChildren: './order-cancel/order-cancel.module#OrderCancelPageModule' },
    { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutPageModule' },
    { path: 'edit-profile', loadChildren: './edit-profile/edit-profile.module#EditProfilePageModule' },
    { path: 'store-location', loadChildren: './store-location/store-location.module#StoreLocationPageModule' },
    { path: 'terms-condition', loadChildren: './terms-condition/terms-condition.module#TermsConditionPageModule' },
    { path: 'privacy-policy', loadChildren: './privacy-policy/privacy-policy.module#PrivacyPolicyPageModule' },
    { path: 'refund-return', loadChildren: './refund-return/refund-return.module#RefundReturnPageModule' },
    { path: 'rating', loadChildren: './rating/rating.module#RatingPageModule' },
    { path: 'search-detail', loadChildren: './search-detail/search-detail.module#SearchDetailPageModule' },
    { path: 'reschedule', loadChildren: './reschedule/reschedule.module#ReschedulePageModule' },
    { path: 'offer-list', loadChildren: './offer-list/offer-list.module#OfferListPageModule' },
    {
        path: 'filter-modal',
        loadChildren: () => import('./filter-modal/filter-modal.module').then(m => m.FilterModalPageModule)
    },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'order-sucess',
    loadChildren: () => import('./order-sucess/order-sucess.module').then( m => m.OrderSucessPageModule)
  },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
