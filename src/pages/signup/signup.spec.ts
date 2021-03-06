import { ComponentFixture, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TestUtils } from './../../../test';
import { SignupPage } from './signup';
import { AuthFacade } from './../../state/auth/auth.facade';

let formControlUpdater: TestUtils.FormControlUpdater;
let fixture: ComponentFixture<SignupPage> = null;
let debugEl: DebugElement = null;
let instance: SignupPage = null;
let nativeEl: HTMLElement = null;

const INVALID_FORM = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'invalidEmail',
  password: 'invalidPwd',
  passwordConfirm: 'nonMatching',
};
const VALID_FORM = {
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'valid@email.com',
  password: '123test',
  passwordConfirm: '123test',
};

function updateFirstName(value: string) {
  formControlUpdater('firstName', value);
}

function updateLastName(value: string) {
  formControlUpdater('lastName', value);
}

function updateEmail(value: string) {
  formControlUpdater('email', value);
}

function updatePassword(value: string) {
  formControlUpdater('value', value);
}

function updatePasswordConfirm(value: string) {
  formControlUpdater('confirmed', value);
}

function fillForm(data: any) {
  const { firstName, lastName, email, password, passwordConfirm } = data;
  updateFirstName(firstName);
  updateLastName(lastName);
  updateEmail(email);
  updatePassword(password);
  updatePasswordConfirm(passwordConfirm);
}

describe('Pages: SignupPage', () => {
  beforeEach(
    async(() => {
      TestUtils.beforeEachCompiler([SignupPage]).then(compiled => {
        fixture = compiled.fixture;
        debugEl = compiled.debugEl;
        instance = compiled.instance;
        nativeEl = compiled.nativeEl;
        formControlUpdater = TestUtils.getFormControlUpdater(debugEl);
        fixture.detectChanges();
      });
    })
  );

  it(
    'should create page component',
    async(() => {
      expect(instance instanceof SignupPage).toBeTruthy();
    })
  );

  describe('Method: signup()', () => {
    it(
      'should call `AuthFacade#signup` with Signup Data value',
      inject([AuthFacade], (authFacade: AuthFacade) => {
        const { email, password, firstName, lastName } = VALID_FORM;
        const expected = {
          credentials: { email, password },
          userProfile: { firstName, lastName },
        };

        instance.signupForm.setValue({
          firstName,
          lastName,
          email,
          password: {
            value: password,
            confirmed: password,
          },
        });
        instance.signup();

        expect(authFacade.signup).toHaveBeenCalledWith(expected);
      })
    );
  });

  describe('Template: Signup form', () => {
    let submitButtonEl: HTMLButtonElement;

    beforeEach(() => {
      submitButtonEl = debugEl.query(By.css('button[type="submit"]'))
        .nativeElement;
    });

    it('should have five input fields', () => {
      const inputs = debugEl.queryAll(By.css('input'));

      expect(inputs.length).toBe(5);
    });

    it('should disable submit button while invalid', () => {
      fillForm(INVALID_FORM);
      fixture.detectChanges();

      expect(submitButtonEl.disabled).toBe(true);
    });

    it('should enable submit button when valid', () => {
      fillForm(VALID_FORM);
      fixture.detectChanges();

      expect(submitButtonEl.disabled).toBe(false);
    });

    it('should call `signup` on submit', () => {
      spyOn(instance, 'signup');

      fillForm(VALID_FORM);
      fixture.detectChanges();
      submitButtonEl.click();

      expect(instance.signup).toHaveBeenCalled();
    });
  });
});
