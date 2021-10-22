const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs'); 
module.exports = {
    _export: _export
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName, creator,sheets,dataArray) {
    try {
        const workbook = new excelJS.Workbook();
        workbook.creator = creator ; 
 
        sheets.forEach(s => {

            const worksheet = workbook.addWorksheet(`${s}`)
            const data = dataArray[s]
            const fixColumnsDef = columnDefs[s + 'Columns'].slice()
            var columnDef = fixColumnsDef
            
            worksheet.columns = columnDef.map(col => {
                return { key: col.id, header: col.columnTitle, width: col.columnWidth };
            });

            for (const d of data) {
                let rowData = {};
                for (const column of columnDef) {
                    if (column.format) {
                        rowData[column.id] = column.format(d[column.propertyName]);
                    }
                    else {
                        rowData[column.id] = d[column.propertyName];
                    }
                }
                var row = worksheet.addRow(rowData);
            }
            worksheet.properties.defaultRowHeight = 25;
            worksheet.properties.defaultColWidth = 30;  

        })

        //now dump custom attributes.

        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync(`./Excel_Exports/${exportName}.xlsx`, buffer, "binary")
        console.log(`./Excel_Exports/${exportName}.xlsx is saved`);
        return true
    } catch (e) {
        console.log(`./Excel_Exports/${exportName}.xlsx failed`);
        return false 
    } 
} 