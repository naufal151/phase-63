const TableDiv = document.querySelector("div.table-responsive");

let tableHeader = ["Judul", "Minggu Ke-", "Deadline", "Rincian"]

const createProjectTable = () => {
    while (TableDiv.firstChild) TableDiv.removeChild(TableDiv.firstChild)

    let projectTable = document.createElement('table');
    projectTable.className = "table text-nowrap mb-0 table-project";

    let projectTableHead = document.createElement('thead');
    projectTableHead.className = "table-light table-head";

    let projectTableRow = document.createElement('tr');
    projectTableRow.className = "table-row";

    tableHeader.forEach(header => {
        let projectHeader = document.createElement('th');
        projectHeader.innerHTML = header;
        projectTableRow.append(projectHeader);
    });

    projectTableHead.append(projectTableRow);
    projectTable.append(projectTableHead);

    let projectTableBody = document.createElement('tbody');
    projectTableBody.className = "table-body";
    projectTable.append(projectTableBody);

    TableDiv.append(projectTable);
};
