import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import ReactFileReader from 'react-file-reader';
import './App.css';
const ReactDataGrid = require('react-data-grid');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      columns: [
        {
          key: 'Column1',
          name: 'Column1',
          editable:true,
        },
        {
          key: 'Column2',
          name: 'Column2',
          editable:true,
        },
        {
          key: 'Column3',
          name: 'Column3',
          editable:true,
        },
        {
          key: 'Column4',
          name: 'Column4',
          editable:true,
        },
      ],
      rows: [{ Column1:'a', Column2:'b', Column3:'c', Column4:'d' }],
    };
    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridRowsUpdated = this.handleGridRowsUpdated.bind(this);
    this.addRow = this.addRow.bind(this);
    this.handleFiles = this.handleFiles.bind(this);
    this.convertToJson = this.convertToJson.bind(this);
  }

  convertToJson = csv => {
    let csvjson = require('csvjson');
    var options = {
      delimiter : ',',
      quote     : '"',
    };
    return csvjson.toObject(csv, options);
  }

  handleFiles = files => {
    console.log(files);
    let reader = new FileReader();
    
    reader.onloadend = (e) => {
      let result = reader.result;
      let data = this.convertToJson(result);

      console.log(this.state.rows);
      this.setState({rows: data});
      console.log(data);
      /*console.log(result);
      let array = result.split('\n');
      console.log(array);
      array = array.map((arr) => {
        return arr.split(',');
      });
      console.log(array);*/
    }
    reader.readAsText(files[0]);
  } 

  rowGetter(i) {
    return this.state.rows[i];
  }

  addRow() {
    let rows = this.state.rows.slice();
    rows.push({ Column1:'', Column2:'', Column3:'', Column4:'' })
    this.setState({rows});
  }

  handleGridRowsUpdated({ fromRow, toRow, updated}){
    let rows = this.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = { ...rowToUpdate, ...updated };
      rows[i] = updatedRow;
    }

    this.setState({ rows });
  }

  render() {
    return (
      <div className="App">
        <ReactDataGrid
          enableCellSelect = { true }
          columns = { this.state.columns }
          rowGetter = { this.rowGetter }
          rowsCount = { this.state.rows.length }
          minHeight = { 500 }
          onGridRowsUpdated = { this.handleGridRowsUpdated }

        />
        <button onClick = {this.addRow}>"Add row"</button>
        <CSVLink data={this.state.rows} className = "btn btn-primary" target = "_blank">
          { 'Download CSV' }
        </CSVLink>
        <ReactFileReader handleFiles={this.handleFiles} fileTypes = { '.csv' }>
          <button className='btn'>Upload</button>
        </ReactFileReader>
      </div>
    );
  }
}

export default App;
