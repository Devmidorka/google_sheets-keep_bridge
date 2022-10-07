import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export interface ISheetRow{
  c:  ({v: string | number, f?:string} | null)[]
}


export interface ISheetCol{
  id: string,
  label: string,
  type:string,
  pattern?:string
}

export interface ISheetTable{
  cols: ISheetCol[],
  rows: ISheetRow[],
  parsedNumHeaders: number
}

export interface ISheetData{
  table: ISheetTable,
  version: string,
  reqId: string,
  sig: string,
  status: string
}


@Injectable({
  providedIn: 'root'
})
export class SheetsService{
  private _base:string = '';
  private readonly _query:string;
  private _url: string = '';
  private _sheetId:string = '';
  private _sheetName:string = '';
  public data: [] = [];

  constructor(private http: HttpClient) {
    this._query = encodeURIComponent('Select *');
    this.createUrls()
  }


  private createUrls(){
    this._base = `https://docs.google.com/spreadsheets/d/${this._sheetId}/gviz/tq?`;
    this._url = `${this._base}&sheet=${this._sheetName}&tq=${this._query}`
  }

  public changeSheet(sheetId:string, sheetName:string){
    this._sheetId = sheetId
    this._sheetName = sheetName
    this.createUrls()
  }

  public getSheetData():Observable<ISheetData>{
    return this.http.request('GET', this._url, {responseType: 'text'}).pipe(
      map(resp => resp.substring(47).slice(0, -2)),
      map(text => JSON.parse(text))
    )
  }


  public parseSheetData(sheetTable: ISheetTable){
    const parsedData: Object[] = [];
    sheetTable.rows.forEach((row, rowIndex) => {
      let parsedObject:Record<string, string|number|null> = {
        id: rowIndex + 1
      }
      sheetTable.cols.forEach((col, colIndex) => {
        parsedObject[col.label] = row.c[colIndex]?.v || null
      })
      parsedData.push(parsedObject)
    })
    return parsedData
  }
}
