import { Component, OnInit } from '@angular/core';
import { RegisterInfo } from '../entities/register';
import { ToasterComponent } from '../toaster.component';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  regObj = new RegisterInfo();
  user_image:string;
  is_changed:boolean;
  selectedFile:File;

  constructor(private toaster:ToasterComponent,
    private common:CommonService,
    private route:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('UserData'))
      {        
        this.common.get_user_data(JSON.parse(localStorage.getItem('UserData')).id)
        .subscribe(data => {
          this.regObj = data
          this.user_image = `http://localhost:8000/api/upload/${this.regObj.id}`
          localStorage.setItem('UserData',JSON.stringify(data))
        })
      }
    else {
      this.route.navigateByUrl('register');
      this.toaster.showError('User Not Logged In');
    }
  }

  value_changed(id:string) {    
    let new_value = eval(`this.regObj.${id}`)
    this.is_changed = true
  }

  getImage(event) {
    let file = event.target.files
      ? event.target.files[0]
      : console.error('No File Selected');
    if (file && file.type.match(/image.*/)) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (imageEvent) => {
        document
          .getElementById('profile_image')
          .setAttribute('src', reader.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
      this.is_changed=true;
    } else {
      this.selectedFile = undefined;
      this.toaster.showWarning('Select Image Type Only');
    }
  }

  uploadImage() {
    let image_data = new FormData();
    image_data.append('file',this.selectedFile);
    this.common.uploadImage(image_data,JSON.parse(localStorage.getItem('UserData')).id)
    .subscribe(data => this.toaster.showSuccess(data['success']),
    err => this.toaster.showError(err['error']))
  }

  update_changes() {
    if(this.selectedFile) this.uploadImage()
    this.common.update_values(this.regObj)
    .subscribe(data => this.toaster.showSuccess(data['success']),
    err => this.toaster.showError('Error Occured Contact Support'),
    () => localStorage.setItem('UserData',JSON.stringify(this.regObj)))
  }

  user_logout() {
    this.common.logout_user()
    .subscribe(data => this.toaster.showSuccess(data['success']),
    err => this.toaster.showError('User Not Authenticated'),
    () => {
      localStorage.removeItem('UserData');
      this.route.navigateByUrl('register')
    })
  }

}
