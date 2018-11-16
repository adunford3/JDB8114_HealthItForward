import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {SurveyModel} from "../core/survey.model";
import {SurveyService} from "../core/survey.service";

@Component({
    selector: 'hif-surveys',
    templateUrl: './surveys.component.html',
    styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {

    selectedSurvey;
    surveys;
    form: FormGroup;

    groupTags = [
        {id: 100, name: 'Parkinsons'},
        {id: 200, name: 'Diabetes'},
        {id: 300, name: 'Yoga'},
        {id: 400, name: 'General Health'}
    ];

    constructor(private formBuilder: FormBuilder,
                public surveyService: SurveyService) {
        // Create a new array with a form control for each order
        const controls = this.groupTags.map(c => new FormControl(false));
        controls[0].setValue(true); // Set the first checkbox to true (checked)

        this.form = this.formBuilder.group({
            name: [''],
            url: [''],
            groupTags: new FormArray(controls)
        });
    }

    ngOnInit() {
        const s = this.surveyService.getSurveys().then(function (surveys) {
            console.log('Survey Stuff Here:');
            console.log(surveys);
            console.log('SurveyName: ' + surveys[0].surveyName);
            return surveys;
        });
        this.surveys = Promise.resolve(s);

        console.log(this.surveys);
    }

    linkClick(survey: SurveyModel) {
        this.selectedSurvey = survey
        this.surveyService.updateClickCount(survey.surveyID, Number(survey.clickCount));
        location.reload(true);
    }

    onSubmit() {
        const selectedOrderIds = this.form.value.groupTags
            .map((v, i) => v ? this.groupTags[i].name : null)
            .filter(v => v !== null);
        let mySurvey = new SurveyModel("0", selectedOrderIds, "", this.form.value.name, this.form.value.url);
        this.surveyService.addSurvey(mySurvey);
        location.reload(true);
        alert("Your survey '" + this.form.value.name + "' has been posted!");
    }
}
