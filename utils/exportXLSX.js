import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportXLSX = async (name, id, orderNomen) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "excelExport-function_dev-01";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.name = `Спецификация_${name}-${id}`;

  const columnWidths = [0, 0, 0, 0, 0];

  const headers = [
    "Артикул",
    "Производитель",
    "Наименование",
    "Единица",
    "Количество",
  ];

  // Add header row
  worksheet.addRow(["Спецификация для контрагента ПЭК по проекту КВЗ"]);
  worksheet.addRow([]);
  worksheet.addRow(headers);

  headers.map((value, index) => {
    columnWidths[index] = Math.max(columnWidths[index], value.length);
  });

  // Add data rows
  orderNomen.map((item) => {
    const rowData = [
      item.vendor,
      item.manname,
      item.fullname,
      item.unit,
      String(item.count),
    ];
    rowData.map((value, index) => {
      columnWidths[index] = Math.max(columnWidths[index], value.length);
    });
    worksheet.addRow(rowData);
  });

  columnWidths.map((width, index) => {
    worksheet.getColumn(index + 1).width = width + 2;
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Спецификация ${name}-${id}`);
};

export default exportXLSX;
