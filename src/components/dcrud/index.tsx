import React, {useCallback, useRef} from "react";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {IDatasource} from "ag-grid-community";

import axios from "axios";

interface DcrudProps {
  options: {
    table: string;
  };
}

const DCrud: React.FC<DcrudProps> = ({options}) => {
  const {table} = options;
  const gridRef = useRef<AgGridReact>(null);

  const [columnDefs, setColumnDefs] = React.useState<any[]>([]);

  //create a column
  /*
  const columnDefs = [
    {
      headerName: "Make",
      field: "make",
      sortable: true,
      filter: true,
      checkboxSelection: true,
    },
    {
      headerName: "Model",
      field: "model",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Price",
      field: "price",
      sortable: true,
      filter: true,
    },
  ];
  */

  //create row data
  /*
  const rowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000},
  ];
  */

  //create a function to get the gridApi
  const onGridReady = useCallback((params: any) => {
    // eslint-disable-next-line no-console
    console.log(params);
  }, []);

  const getFieldNamesArray = async (responseData: any) => {
    const fieldNames = Object.keys(responseData[0]);
    const columnDefs = fieldNames.map((fieldName) => {
      if (fieldName.toLowerCase() === "id") {
        return {
          headerName: "",
          field: "id",
          sortable: true,
          filter: true,
          checkboxSelection: true,
        };
      } else {
        return {
          headerName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1),
          field: fieldName,
          sortable: true,
          filter: true,
        };
      }
    });
    return columnDefs;
  };

  const infiniteDatasource: IDatasource = {
    getRows: async (params) => {
      // eslint-disable-next-line no-console
      console.log("asking for " + params.startRow + " to " + params.endRow);

      const url = `${process.env.NEXT_PUBLIC_API_URL}/${table}`;
      const headers = {
        "Content-Type": "application/json",
      };

      try {
        const response = await axios.get(url, {headers});
        // eslint-disable-next-line no-console
        console.log(response.data);

        if (columnDefs.length === 0) {
          const columnDefs = await getFieldNamesArray(response.data);
          setColumnDefs(columnDefs);
        }

        params.successCallback(response.data, response.data.length);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return null;
      }
      /*
      setTimeout(function () {
        const rowsThisPage = rowData.slice(params.startRow, params.endRow);
        let lastRow = -1;
        if (rowData.length <= params.endRow) {
          lastRow = rowData.length;
        }
        params.successCallback(rowsThisPage, lastRow);
      }, 500);
      */
    },
  };

  return (
    <div
      className="ag-theme-alpine-dark"
      style={{height: "100%", width: "100%"}}>
      <AgGridReact
        ref={gridRef}
        columnDefs={columnDefs}
        rowSelection="multiple"
        onGridReady={onGridReady}
        rowModelType="infinite"
        datasource={infiniteDatasource}
        defaultColDef={{
          flex: 1,
        }}
      />
    </div>
  );
};

export default DCrud;
