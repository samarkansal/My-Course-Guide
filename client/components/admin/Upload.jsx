import React, { Component } from "react";
import { server } from "../../utils/config";

import ReactTable from "react-table";
import "react-table/react-table.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

let xhook = require("xhook");

// Import FilePond
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidRows: null,
      cols: null
    };
  }
  render() {
    let clearTable = () => {
      this.setState({
        invalidRows: null,
        cols: null
      });
    };
    let enableHook = () => {
      xhook.enable();
      xhook.after((req, res, next) => {
        if (res.status == 400) {
          xhook.disable();
          let rows = JSON.parse(res.data).invalidRows;
          let keys = Object.keys(rows[0]);
          let cols = [];
          keys.forEach(key => {
            cols.push({
              Header: key,
              accessor: key
            });
          });
          this.setState({ invalidRows: rows, cols });
        }
        next();
      });
    };
    return (
      <Container>
        <br />
        <Row>
          <Col lg={12}>
            <FilePond
              name="csv"
              server={`${server}/api/csv`}
              onremovefile={clearTable}
              onaddfile={enableHook}
            />
            {this.state.cols ? (
              <div>
                <p>
                  Errors were encountered while parsing the following lines in
                  the uploaded file
                </p>
                <ReactTable
                  data={this.state.invalidRows}
                  columns={this.state.cols}
                  defaultPageSize={5}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Upload;