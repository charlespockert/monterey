import {inject, bindable, NewInstance} from 'aurelia-framework';
import {ValidationRules}               from 'aurelia-validatejs';
import {ValidationController}          from 'aurelia-validation';
import {IStep}                         from './istep';

@inject(NewInstance.of(ValidationController), Element)
export class Question {
  @bindable step: IStep;
  state;

  constructor(private validation: ValidationController,
              private element: Element) {
  }

  activate(model) {
    this.state = model.state;
    this.step = model.step;
    this.step.execute = () => this.execute();
    this.step.previous = () => this.previous();
    this.stepChanged();
  }

  // whenever a step changes, reapply the validation rules
  // necessary because the entire step instance changes, not just values of the step
  stepChanged() {
    ValidationRules
    .ensure('answer').required()
    .on(this.step);
  }

  attached() {
    this.focusInput();
  }

  async execute() {
    return {
      goToNextStep: this.validation.validate().length === 0
    };
  }

  async previous() {
    return {
      goToPreviousStep: true
    };
  }

  // get the first form-control and focus that element
  focusInput() {
    let input = <HTMLElement>this.element.querySelectorAll('.form-control')[0];
    if (input) {
      input.focus();
    }
  }
}
