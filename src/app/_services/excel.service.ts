import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  //Heading = [
  //  ["CFA Code", "CFA Name", "CFA Place", "Reference ID", "Stockist Code",
  //    "Stockist Name", "Stockist City", "Stockist Place", "Pre Claim No.",
  //    "Pre Claim Date", "Stockist Ref.No.", "Stockist Ref. Date", "Claim Register Name",
  //    "Claim Doc No.", "Claim Date", "Reason", "Return Type", "Document Amount",
  //    "Final Amount", "File Upload Status", "Claim Status", "Latest Updated By", "Latest Updated On"],
  //];
  constructor() { }

  public exportAsExcelFile(json: any[], excelFileName: string, Heading:any): void {

    const worksheet = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, Heading);
    XLSX.utils.sheet_add_json(worksheet, json, { origin: 'A2', skipHeader: true });
    //const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, { skipHeader: true });
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
