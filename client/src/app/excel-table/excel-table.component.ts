import {Component, OnInit} from '@angular/core';
import {IParsedData, SheetsService} from "../sheets.service";

@Component({
  selector: 'app-excel-table',
  templateUrl: './excel-table.component.html',
  styleUrls: ['./excel-table.component.css']
})
export class ExcelTableComponent implements  OnInit {
  dataSource: IParsedData = []
  displayedColumns:string[] = []
  constructor(private sheetsService: SheetsService) {}

  ngOnInit() {
    this.sheetsService.changeSheet('1MB007a6clL4NlGF_vXAp0-eR9UvuQ2YOnSwIBstVVkQ', 'user-data')
    this.sheetsService.getSheetData().subscribe({
      next: (data) => {
        this.dataSource = this.sheetsService.parseSheetData(data.table)
        this.displayedColumns = Object.keys(this.dataSource[0])
      }
    })

  }
}
