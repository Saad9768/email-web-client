import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EmailService } from '../email.service/email.service';
import { SocketIoService } from '../socket.service/socket-io.service';
import { EmailData } from './email.interface';
import { v4 as uuid } from 'uuid';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
// import * as _ from 'lodash';

@Component({
  selector: 'app-email-client',
  templateUrl: './email-client.component.html',
  styleUrls: ['./email-client.component.css']
})
export class EmailClientComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  sub: Subscription;
  progressRecieved: { progress: number, requestId: string }[] = [];
  color: ThemePalette = 'accent';
  mode: ProgressBarMode = 'determinate';
  bufferValue: number = 10;
  constructor(private formBuilder: FormBuilder,
    private socketService: SocketIoService,
    private emailService: EmailService
  ) { }
  ngOnDestroy(): void {
    console.log('inside ngOnDestroy')
    this.unSubscribeToListener();
  }

  ngOnInit(): void {
    console.log('inside ngOnInit')
    this.form = this.formBuilder.group({
      toEmail: ['', [Validators.required]],
      ccEmail: [''],
      bccEmail: [''],
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
    this.subscribeToListener();
  }
  subscribeToListener() {
    console.log('inside subscribeToListener')
    this.unSubscribeToListener();
    const subscriberName = localStorage.getItem('username');
    this.sub = this.socketService.listenToServer(subscriberName).subscribe((data) => {
      console.log('data ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::', data)
      this.updateprogressRecieved(data)
    })
  }
  updateprogressRecieved(data: any) {
    const selIndex = this.progressRecieved.findIndex(r => r.requestId === data.requestId);
    if (selIndex !== -1) {
      this.progressRecieved[selIndex] = data;
    } else {
      this.progressRecieved.push(data);
    }
  }
  unSubscribeToListener() {
    console.log('inside unSubscribeToListener')

    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const emailData: EmailData = {
      toEmail: this.form.get('toEmail') ? this.form.get('toEmail')?.value.split(';') : '',
      ccEmail: this.form.get('ccEmail') ? this.form.get('ccEmail')?.value.split(';') : '',
      bccEmail: this.form.get('bccEmail') ? this.form.get('bccEmail')?.value.split(';') : '',
      subject: this.form.get('subject') ? this.form.get('subject')?.value : '',
      description: this.form.get('description') ? this.form.get('description')?.value : '',
      requestId: uuid()
    }
    this.emailService.sendEmail(emailData)
      .subscribe({
        next: (data) => {
          console.log('data :: ', data)
        }, error: (err) => {
          console.log('err :: ', err)
        }
      });
  }
  checkErrorEmail(ctrl: any) {
    return (this.validateEmail(ctrl.value) || ctrl.errors) && ctrl.touched;
  }
  validateEmail(value: string) {
    let returnValue: boolean = false;
    value = value.toLowerCase();
    if (value) {
      const splitEmail = value.split(';');
      splitEmail.forEach((r: any) => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(r)) {
          returnValue = true;
        }
      });
    }
    return returnValue;
  }

  getValue(prog: any) {
    console.log('prog.progress ::', prog.progress)
    return prog.progress;
  }

}
