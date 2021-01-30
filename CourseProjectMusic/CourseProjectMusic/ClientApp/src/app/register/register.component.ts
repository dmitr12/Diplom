import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { RegisterService } from '../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(private rs: RegisterService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      login: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      passwords: new FormGroup({
        psw: new FormControl(null, [Validators.required, Validators.minLength(6)]),
        confirmpsw: new FormControl(null, [Validators.required, Validators.minLength(6)])
      }, this.passwordAreEqual())
    });
  }

  passwordAreEqual(): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      if (!(group.dirty || group.touched) || group.get('psw').value === group.get('confirmpsw').value) {
        return null;
      }
      return { custom: 'Passwords are not equal' };
    };
  }

  onSubmit() {
    this.rs.register(this.form.value.email, this.form.value.login, this.form.value.passwords.psw).subscribe(res => {
      if (res['msg']!='')
        alert(res['msg'])
      else
        this.router.navigate(['']);
    }, error => {
      alert("При отправке запроса возникла ошибка, статусный код "+error.status);
    });
  }
}
