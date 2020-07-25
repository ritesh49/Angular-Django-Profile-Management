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
  valid = 0

  constructor(private toaster:ToasterComponent,
    private common:CommonService,
    private route:Router) { }

  ngOnInit(): void {
    // Runs when the Component get initialized into memory

    if(localStorage.getItem('UserData'))
      {        
          this.regObj = JSON.parse(localStorage.getItem('UserData'));
          // this.user_image = `http://18.206.208.159${this.regObj.profile_image}` // Used for Production
          this.user_image = `http://localhost:8000${this.regObj.profile_image}`
      }
    else {
      this.route.navigateByUrl('register');
      this.toaster.showError('User Not Logged In');
    }
  }

  validate_values() {
    // Validating the Values entered by user

    if (JSON.stringify(this.regObj.phone_no).length > 12)
      this.toaster.showWarning('Enter Valid Phone No.')    
    else if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(this.regObj.email_id))
      this.toaster.showWarning('Invalid Email')
    else if(!/[A-Z]{1}[0-9]{7}/.test(this.regObj.passport_num))
      this.toaster.showWarning('Passport No. should contains First capital letter and 8 integers');
    else this.valid = 1;
  }

  validate_inputs() {
    // Checking for Empty Values in inputs

    if(this.regObj.full_name == undefined)    
      document.getElementById('full_name').style.borderColor = 'red';
    else if(this.regObj.dob == undefined)
      document.getElementById('dob').style.borderColor = 'red';
    else if(this.regObj.phone_no == undefined)
      document.getElementById('phone_no').style.borderColor = 'red';
    else if(this.regObj.email_id == undefined)
      document.getElementById('email_id').style.borderColor = 'red';
    else if(this.regObj.passport_num == undefined)      
        document.getElementById('passport_num').style.borderColor = 'red';      
    else this.validate_values()
  }

  value_changed(id:string) { 
    // Checking whether any value changed in inputs
    
    let new_value = eval(`this.regObj.${id}`)
    this.is_changed = true
  }

  getImage(event) {
    // Getting the image file through event thrown by input type="file"

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
    // Changing profile photo
    let image_data = new FormData();
    image_data.append('file',this.selectedFile);
    this.common.uploadImage(image_data,JSON.parse(localStorage.getItem('UserData')).id)
    .subscribe(data => this.toaster.showSuccess(data['success']),
    err => this.toaster.showError('Error While Uploading Image'))
  }

  update_changes() {
    // Saving the Values Changed by user

    if(this.selectedFile) this.uploadImage()
    this.validate_inputs();

    if(this.valid)
    {
      delete this.regObj.profile_image;
      this.common.update_values(this.regObj)
      .subscribe(data => this.regObj = data),
      err => this.toaster.showError('Error Occured Contact Support'),
      () => localStorage.setItem('UserData',JSON.stringify(this.regObj))
    }
    else this.toaster.showWarning('Fill the Details Correctly Before Submitting')
  }

  user_logout() {
    // Logging out user and removing sessions through Backend
    this.common.logout_user()
    .subscribe(data => this.toaster.showSuccess(data['success']),
    err => this.toaster.showError('User Not Authenticated'),
    () => {
      localStorage.removeItem('UserData');
      this.route.navigateByUrl('register')
    })
  }

}
