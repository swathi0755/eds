
function getData(block){

      if (!block) return;

      // Extract all rows from the div structure
      const rows = Array.from(block.children).map(row =>
          Array.from(row.children).map(cell => cell.textContent.trim())
      );

      // Create table element
      const table = document.createElement("table");
      table.border = "1";
      table.style.borderCollapse = "collapse";

      // Generate table rows
      rows[0].forEach((_, colIndex) => {
          const tr = document.createElement("tr");
          rows.forEach(row => {
              const td = document.createElement("td");
              td.textContent = row[colIndex] || "";
              td.style.padding = "5px";
              tr.appendChild(td);
          });
          table.appendChild(tr);
      });
      return tableToJson(table);
}
function tableToJson(table) {
    let json = [];
    let headers = [];

    // Get table headers
    const headerCells = table.querySelectorAll("thead th, tbody tr:first-child td");
    headerCells.forEach(th => headers.push(th.textContent.trim()));

    // Get table rows
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
        let obj = {};
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
            obj[headers[index] || `Column${index + 1}`] = cell.textContent.trim();
        });

        json.push(obj);
    });

    return json;
}