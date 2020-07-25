import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { strict } from 'assert';
import { RegisterInfo } from '../entities/register';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:HttpClient) { }
  private djangoUrl = 'http://localhost:8000/';
  // private djangoUrl = 'http://18.206.208.159/' // Used for Production
  private login_url = 'api/login/';
  private register_url = 'api/register';
  private upload_url = 'api/upload/';
  private get_user_url = 'api/get_user_data/'
  private logout_url = 'api/logout';

  login_user(phone_no:Number) {    
    return this.http.get(this.djangoUrl + this.login_url + phone_no as string)
  }

  logout_user() {
      return this.http.get(this.djangoUrl+this.logout_url)
  }

  registerUser(regObj:RegisterInfo):Observable<RegisterInfo> {
      return this.http.put<RegisterInfo>(this.djangoUrl+this.register_url,regObj)
  }

  update_values(regObj:RegisterInfo):Observable<RegisterInfo> {
      let httpHeaders = {
          headers:new HttpHeaders({
            'X-CSRFToken': document.cookie ? document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken'))
            .split('=')[1] : 'undefined'
          })
      }
      return this.http.post<RegisterInfo>(this.djangoUrl+this.register_url,regObj,httpHeaders)
  }

  uploadImage(image:FormData,id:number) {
      let httpHeaders = {
          headers:new HttpHeaders({
            'X-CSRFToken': document.cookie ? document.cookie
            .split('; ')
            .find((row) => row.startsWith('csrftoken'))
            .split('=')[1] : 'undefined'
          })
      }
      return this.http.post(this.djangoUrl+this.upload_url+id as string,image,httpHeaders);
  }

  get_user_data(id:number):Observable<RegisterInfo> {
      return this.http.get<RegisterInfo>(this.djangoUrl+this.get_user_url+id as string)
  }
  
}
