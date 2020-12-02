import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationFailed = false;

  userForm: FormGroup;
  loginCtrl: FormControl;
  birthYearCtrl: FormControl;

  passwordForm: FormGroup;
  passwordCtrl: FormControl;
  confirmCtrl: FormControl;

  static passwordMatch(group: FormGroup): { matchingError: true } | null {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { matchingError: true };
  }

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {

    this.loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
    this.birthYearCtrl = this.fb.control('', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]);

    this.passwordCtrl = this.fb.control('', [Validators.required]);
    this.confirmCtrl = this.fb.control('', [Validators.required]);

    this.passwordForm = fb.group(
      {
        password: this.passwordCtrl,
        confirmPassword: this.confirmCtrl,
      },
      {
        validators: RegisterComponent.passwordMatch
      }
    );

    this.userForm = fb.group({
      login: this.loginCtrl,
      passwordForm: this.passwordForm,
      birthYear: this.birthYearCtrl,
    });
  }

  ngOnInit(): void {
  }

  register(): void {
    this.userService.register(this.loginCtrl.value, this.passwordCtrl.value, this.birthYearCtrl.value)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: () => { this.registrationFailed = true; },
      });
  }

}
