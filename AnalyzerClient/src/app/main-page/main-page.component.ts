import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit {
  isProcessing: boolean = false;
  analyzeResult: object = null;
  error: object = null;

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {}

  analyzeHandler(siteName: string) {
    this.isProcessing = true;
    this.error = null;
    this.analyzeResult = null;
    this.httpClient
      .post("http://localhost:3000/analyze", { site: siteName }, {})
      .subscribe(
        res => {
          console.log(res);
          this.analyzeResult = res;
          this.isProcessing = false;
        },
        err => {
          console.log(err);
          this.error = err;
          this.isProcessing = false;
        }
      );
  }
}
