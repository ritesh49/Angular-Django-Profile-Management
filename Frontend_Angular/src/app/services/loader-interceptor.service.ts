import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToasterComponent } from './../toaster.component'
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class LoaderInterceptorService implements HttpInterceptor {
  constructor(
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private toaster: ToasterComponent
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.spinner.show();
    return next
      .handle(
        req.clone({
          setHeaders: {
          }
        })
      )
      .pipe(
        tap(
          (event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.spinner.hide();
            }
          },
          (err) => {            
            this.spinner.hide();       
          }
        )
      );
  }
}
