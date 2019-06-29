import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "AnalyzerClient";
  constructor(private httpClient: HttpClient) {
    this.getPing();
  }

  getPing() {
    this.httpClient.get("http://localhost:3000/ping").subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }
}
