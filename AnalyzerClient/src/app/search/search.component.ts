import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  @Input() isProcessing: boolean = false;
  @Output() analyzeEvent: EventEmitter<string> = new EventEmitter<string>();
  siteName: string = "";
  constructor() {}

  ngOnInit() {}

  onAnalyzeSite(): void {
    this.analyzeEvent.emit(this.siteName);
  }
}
