import { Component, OnInit } from '@angular/core';
import { RegisterInfo } from '../entities/register';
import { ToasterComponent } from '../toaster.component';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {  
  constructor(
    private toaster:ToasterComponent,
    private common:CommonService,
    private route:Router
  ) { }

  ngOnInit(): void {
  }  
  regObj = new RegisterInfo();
  profile_img = '/assets/images/profile_image.jpg'
  valid = 0;
  selectedFile:File;
  user_data:RegisterInfo;

  validate_values() {
    if (JSON.stringify(this.regObj.phone_no).length > 12)
      this.toaster.showWarning('Enter Valid Phone No.')    
    else if(!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(this.regObj.email_id))
      this.toaster.showWarning('Invalid Email')
    else if(!/[A-Z]{1}[0-9]{7}/.test(this.regObj.passport_num))
      this.toaster.showWarning('Passport No. should contains First capital letter and 8 integers');
    else this.valid = 1;
  }

  validate_inputs() {
    // Function For Validating all inputs
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
  
  remove_background(id:string)
  {
    // Removing the Red Border Color on click

    document.getElementById(id).style.borderColor = 'white';
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
    } else {
      this.selectedFile = undefined;
      this.toaster.showWarning('Select Image Type Only');
    }
  }

  login_user() {
    // Logging in the user

    if(this.regObj.phone_no != undefined)
    {
      this.common.login_user(this.regObj.phone_no)
      .subscribe(data => {
        localStorage.setItem('UserData',JSON.stringify(data))
        this.toaster.showSuccess('User Logged In');
      },
      err => this.toaster.showError('User with This Phone No. Does Not Exits'),
      () => this.route.navigateByUrl('dashboard'))
    }
    else this.toaster.showInfo('Fill the Phone_no before login');
  }

  register_user() { 
    // Registering User if all inputs are valid
    
    this.validate_inputs()
    if(this.valid) {      
      this.common.registerUser(this.regObj)
      .subscribe(data => {
        this.user_data = data
        localStorage.setItem('UserData',JSON.stringify(data))        
        this.toaster.showSuccess('User Successfully Created');
      },
      err => {
        if(err.status == 409)
          this.toaster.showWarning('User with This Phone no. Already Exists')
        else this.toaster.showError('Error Occured While Registering')
      },
      () => {
        if(this.selectedFile)
          this.uploadImage()
        else this.login_user();
      })
    }
    else this.toaster.showInfo('Fill the Details Correctly before Submitting');
  }  

  uploadImage() {
    // Uploading image if user has selected some image

    let image_data = new FormData();
    image_data.append('file',this.selectedFile);
    this.common.uploadImage(image_data,this.user_data.id)
    .subscribe(data => this.toaster.showSuccess(data['success']),
    err => this.toaster.showError('Error Occured While Uploading Image'),
    () => this.login_user())
  }

}
