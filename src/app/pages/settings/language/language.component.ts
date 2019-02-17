import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "ui/page";
import { View } from "tns-core-modules/ui/core/view";

@Component({
  selector: 'ns-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css'],
  moduleId: module.id,
})
export class LanguageComponent implements OnInit {

  countries = ["Albania", "Andorra", "Australia", "Belgium", "Bulgaria", "Cyprus", "Denmark", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Japan", "Latvia", "Luxembourg", "Macedonia", "Moldova", "Monaco", "Netherlands", "Norway", "Poland", "Romania", "Russia", "Slovakia", "Slovenia", "Sweden", "Turkey", "Ukraine", "USA"];

  current = "Belgium";

  constructor(private page: Page, private router: RouterExtensions) {
    this.page.actionBarHidden = true;
  }

  ngOnInit() {
  }

  goPrevPage() {
    this.router.navigate(["/settings"], {
      transition: {
        name: "slideRight",
        duration: 500,
        curve: "easeOut"
      }
    })
  }

  getImageName(value) {
    return "~/app/assets/images/countries/" + value.toLowerCase() + ".png";
  }

  selectLanguage(country: string) {
    this.current = country;
    setTimeout (() => {this.goPrevPage();}, 100);    
  }

}
