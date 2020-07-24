import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NotifierModule, NotifierOptions } from "angular-notifier";
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './register/register.component';
import { CommonService } from './services/common.service'
import { ToasterComponent } from './toaster.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoaderInterceptorService } from './services/loader-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: "right",
      distance: 12,
    },
    vertical: {
      position: "top",
      distance: 50,
      gap: 10,
    },
  },  
  behaviour: {
    autoHide: 8000,
    onClick: false,
    onMouseover: "pauseAutoHide",
    showDismissButton: true,
    stacking: 3,
  },
  animations: {
    enabled: true,
    show: {
      preset: "slide",
      speed: 300,
      easing: "ease",
    },
    hide: {
      preset: "fade",
      speed: 300,
      easing: "ease",
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: "ease",
    },
    overlap: 150,
  },
};
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,    
    DashboardComponent,
    ToasterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NotifierModule.withConfig(customNotifierOptions),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    HttpClient,
    CommonService,
    ToasterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
