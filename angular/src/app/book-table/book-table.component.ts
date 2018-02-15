import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatCheckbox } from '@angular/material';
import { BookTableDialogComponent } from './book-table-dialog/book-table-dialog.component';
import { InvitationDialogComponent } from './invitation-dialog/invitation-dialog.component';
import { WindowService } from '../core/windowService/windowService.service';
import { SnackBarService } from '../core/snackService/snackService.service';
import { emailValidator, EmailValidatorDirective } from '../shared/directives/email-validator.directive';
import { last } from 'lodash';
import { ReservationInfo, BookingInfo } from 'app/shared/backendModels/interfaces';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { AbstractControl } from '@angular/forms/src/model';

@Component({
  selector: 'public-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.scss'],
})

export class BookTableComponent implements OnInit {

  invitationModel: string[] = [];
  minDate: Date = new Date();
  bookForm: FormGroup;
  invitationForm: FormGroup;

  reservationInfo: BookingInfo = {
    booking: {
      name: '',
      email: '',
      bookingDate: undefined,
      bookingType: 0,
    },
    invitedGuests: undefined,
  };

  constructor(public window: WindowService,
              public snackBarservice: SnackBarService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.invitationForm = new FormGroup({
      'bookingDate': new FormControl(this.reservationInfo.booking.bookingDate, Validators.required),
      'name': new FormControl(this.reservationInfo.booking.name, Validators.required),
      'email': new FormControl(this.reservationInfo.booking.email, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
      ]),
      'invitedGuests': new FormControl(this.invitationModel),
    });

    this.bookForm = new FormGroup({
      'bookingDate': new FormControl(this.reservationInfo.booking.bookingDate, Validators.required),
      'name': new FormControl(this.reservationInfo.booking.name, Validators.required),
      'email': new FormControl(this.reservationInfo.booking.email, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
      ]),
      'assistants': new FormControl(this.reservationInfo.booking.assistants, [
        Validators.required,
        Validators.min(1),
        Validators.max(8),
      ]),
    });
  }

  get name(): AbstractControl { return this.bookForm.get('name'); }
  get email(): AbstractControl { return this.bookForm.get('email'); }
  get assistants(): AbstractControl { return this.bookForm.get('assistants'); }

  get invName(): AbstractControl { return this.invitationForm.get('name'); }
  get invEmail(): AbstractControl { return this.invitationForm.get('email'); }

  showBookTableDialog(checkbox: MatCheckbox): void {
    this.dialog.open(BookTableDialogComponent, {
      width: this.window.responsiveWidth(),
      data: this.bookForm.value,
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.bookForm.reset();
        checkbox.checked = false;
      }
    });
  }

  showInviteDialog(checkbox: MatCheckbox): void {
    this.dialog.open(InvitationDialogComponent, {
      width: this.window.responsiveWidth(),
      data: this.invitationForm.value,
    }).afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.invitationForm.reset();
        this.invitationModel = [];
        checkbox.checked = false;
      }
    });
  }

  validateEmail(): void {
    if (!emailValidator(last(this.invitationModel))) {
      this.invitationModel.pop();
      this.snackBarservice.openSnack('Email format not valid', 1000, 'red');
    }
  }

}
