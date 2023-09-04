import prisma from "@/prisma/client";
import rounded from "@/utils/round";

const ExcelJS = require("exceljs");
const { format } = require("date-fns");
const { ru, tr } = require("date-fns/locale");

const formatCurrentDateRussian = () => {
  const currentDate = new Date();

  // Format the current date with Russian month name
  const formattedDate = format(currentDate, "dd MMMM yyyy", { locale: ru });

  return formattedDate;
};

const deleteRowBorder = (worksheet, startRow, endRow) => {
  for (let rowNumber = startRow; rowNumber <= endRow; rowNumber++) {
    for (let colNumber = 2; colNumber <= 7; colNumber++) {
      // Columns B to G
      const cell = worksheet.getCell(rowNumber, colNumber);
      cell.border = {
        top: { style: "none" }, // Remove top border
        left: { style: "none" }, // Remove left border
        bottom: { style: "none" }, // Remove bottom border
        right: { style: "none" }, // Remove right border
      };
    }
  }
};

const addArrayToRow = (worksheet, n, dataArray) => {
  const row = worksheet.getRow(n);

  // Loop through the dataArray and set values in respective columns
  for (let colIndex = 2; colIndex <= dataArray.length; colIndex++) {
    const cell = row.getCell(colIndex);
    cell.value = dataArray[colIndex - 1];
    cell.style = {};

    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true, // Enable text wrapping
    };
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { dataArr } = req.body;

    console.log(dataArr);

    try {
      const checkPrice = dataArr.reduce((prev, curr) => {
        return (
          prev + curr.data.cost * curr.amount * (1 + curr.data.margin / 100)
        );
      }, 0);

      const TAX = (checkPrice * 20) / 120;

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile("./templates/template.xlsx");
      if (workbook.getWorksheet(2)) {
        workbook.removeWorksheet(2);
      }
      const ws = workbook.getWorksheet(1);

      ws.getCell("G14").value = `СЧЕТ № ${dataArr[0].data.id}${
        dataArr[0].data.files.length
      } от ${formatCurrentDateRussian()}`;
      ws.getCell("C17").value = dataArr[0].data.contractorName;

      const F25_moved = ws.getCell(`F${25 - 2 + dataArr.length}`);
      F25_moved.value = "Итого: ";
      F25_moved.style = {};
      F25_moved.alignment = { wrapText: true };
      const F26_moved = ws.getCell(`F${26 - 2 + dataArr.length}`);
      F26_moved.value = "В том числе НДС 20%:";
      F26_moved.style = {};
      F26_moved.alignment = { wrapText: true };
      const F27_moved = ws.getCell(`F${27 - 2 + dataArr.length}`);
      F27_moved.value = "Всего к оплате:";
      F27_moved.style = {};
      F27_moved.alignment = { wrapText: true };

      const C33_moved = ws.getCell(`C${33 - 2 + dataArr.length}`);
      C33_moved.value =
        "Счет выписал_____________________ (Азат Залялеев) тел. 8-917-233-93-58";
      C33_moved.style = {};
      C33_moved.alignment = { wrapText: false };

      ws.getColumn("F").width = 25;
      ws.getColumn("G").width = 25;

      const C26_moved = ws.getCell(`C${26 + dataArr.length - 2}`);
      C26_moved.value = `Всего наименований ${dataArr.length} на сумму: `;

      const G25_moved = ws.getCell(`G${25 - 2 + dataArr.length}`);
      G25_moved.value = rounded(checkPrice).toLocaleString("en-EU");
      G25_moved.style = {};
      G25_moved.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "right",
      };

      const G26_moved = ws.getCell(`G${26 - 2 + dataArr.length}`);
      G26_moved.value = rounded(TAX).toLocaleString("en-EU");
      G26_moved.style = {};
      G26_moved.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "right",
      };

      const G27_moved = ws.getCell(`G${27 - 2 + dataArr.length}`);
      G27_moved.value = rounded(checkPrice).toLocaleString("en-EU");
      G27_moved.style = {};
      G27_moved.alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "right",
      };

      dataArr.forEach((item, index) => {
        const localWS = workbook.addWorksheet(`Спецификация для ${index}`);
        localWS.name = `Спецификация_${item.data.name}-${item.data.id}`;

        const columnWidths = [0, 0, 0, 0, 0];

        const headers = [
          "Артикул",
          "Производитель",
          "Наименование",
          "Единица",
          "Количество",
        ];

        localWS.addRow(["Спецификация для контрагента ПЭК по проекту КВЗ"]);
        localWS.addRow([]);
        localWS.addRow(headers);

        headers.map((value, index) => {
          columnWidths[index] = Math.max(columnWidths[index], value.length);
        });

        item.parsedNomen.map((item) => {
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
          localWS.addRow(rowData);
        });

        columnWidths.map((width, index) => {
          localWS.getColumn(index + 1).width = width + 2;
        });

        const rowIndex = 21 + index;
        const data = item.data;
        const fullPrice = item.amount * data.cost * (1 + data.margin / 100);
        const arr = [
          "",
          index + 1,
          data.name,
          "шт",
          item.amount,
          data.cost.toLocaleString("en-EU"),
          fullPrice.toLocaleString("en-EU"),
        ];
        addArrayToRow(ws, rowIndex, arr);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const base64Data = buffer.toString("base64");

      // Set the response headers for Excel file download
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="workbook.xlsx"'
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Length", buffer.length);

      if (req.query.mode === "s") {
        const updateOrder = await prisma.order.update({
          where: { id: dataArr[0].data.id },
          data: {
            files: {
              push: base64Data,
            },
          },
        });
      }

      return res.status(200).send(buffer);
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "error occured while creating xlsx" });
    }

    // try {
    //   const workbook = new ExcelJS.Workbook();
    //   await workbook.xlsx.readFile("./templates/template.xlsx");
    //   if (workbook.getWorksheet(2)) {
    //     workbook.removeWorksheet(2);
    //   }
    //   const ws = workbook.getWorksheet("Sheet1");
    //   const { margin } = order;

    //   ws.getCell("G14").value = `СЧЕТ № ${order.id}${
    //     order.files.length
    //   } от ${formatCurrentDateRussian()}`;
    //   ws.getCell("C17").value = contractor;
    //   ws.getCell("C18").value = project;
    //   ws.getCell("C19").value = "";

    //   const C26_moved = ws.getCell(`C${26 + nomenclature.length - 2}`);
    //   C26_moved.value = `Всего наименований ${nomenclature.length} на сумму: `;

    //   const F25_moved = ws.getCell(`F${25 - 2 + nomenclature.length}`);
    //   F25_moved.value = "Итого: ";
    //   F25_moved.style = {};
    //   F25_moved.alignment = { wrapText: true };

    //   const F26_moved = ws.getCell(`F${26 - 2 + nomenclature.length}`);
    //   F26_moved.value = "В том числе НДС 20%:";
    //   F26_moved.style = {};
    //   F26_moved.alignment = { wrapText: true };

    //   const F27_moved = ws.getCell(`F${27 - 2 + nomenclature.length}`);
    //   F27_moved.value = "Всего к оплате:";
    //   F27_moved.style = {};
    //   F27_moved.alignment = { wrapText: true };

    //   const G25_moved = ws.getCell(`G${25 - 2 + nomenclature.length}`);
    //   G25_moved.value = Number(
    //     order.cost * (1 + order.margin / 100)
    //   ).toLocaleString("en-EU");
    //   G25_moved.style = {};
    //   G25_moved.alignment = {
    //     wrapText: true,
    //     vertical: "middle",
    //     horizontal: "right",
    //   };

    //   const G26_moved = ws.getCell(`G${26 - 2 + nomenclature.length}`);
    //   G26_moved.value = ((order.cost * 20) / 120).toLocaleString("en-EU");
    //   G26_moved.style = {};
    //   G26_moved.alignment = {
    //     wrapText: true,
    //     vertical: "middle",
    //     horizontal: "right",
    //   };

    //   const G27_moved = ws.getCell(`G${27 - 2 + nomenclature.length}`);
    //   G27_moved.value = Number(
    //     order.cost * (1 + order.margin / 100)
    //   ).toLocaleString("en-EU");
    //   G27_moved.style = {};
    //   G27_moved.alignment = {
    //     wrapText: true,
    //     vertical: "middle",
    //     horizontal: "right",
    //   };

    //   const C33_moved = ws.getCell(`C${33 - 2 + nomenclature.length}`);
    //   C33_moved.value =
    //     "Счет выписал_____________________ (Азат Залялеев) тел. 8-917-233-93-58";
    //   C33_moved.style = {};
    //   C33_moved.alignment = { wrapText: false };

    //   ws.getColumn("F").width = 15;
    //   ws.getColumn("G").width = 25;

    //   nomenclature.forEach(async (item, index) => {
    //     const rowIndex = 21 + index;
    //     const { name, unit, count, price } = item;
    //     const fullPrice = count * price * (1 + margin / 100);
    //     const dataArr = ["", index + 1, name, unit, count, price, fullPrice];
    //     addArrayToRow(ws, rowIndex, dataArr);
    //   });
    //   const buffer = await workbook.xlsx.writeBuffer();
    //   const base64Data = buffer.toString("base64");

    //   // Set the response headers for Excel file download
    //   res.setHeader(
    //     "Content-Disposition",
    //     'attachment; filename="workbook.xlsx"'
    //   );
    //   res.setHeader(
    //     "Content-Type",
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //   );
    //   res.setHeader("Content-Length", buffer.length);

    //   const updateOrder = await prisma.order.update({
    //     where: { id: order.id },
    //     data: {
    //       files: {
    //         push: base64Data,
    //       },
    //     },
    //   });

    //   // Send the Excel file as the response
    //   return res.status(200).send(buffer);
    // } catch (err) {
    //   return res.status(500).json({ message: "Error creating xlsx" });
    // }
  } else {
    res.status(405).json({ error: "method not allowed" });
  }
}
