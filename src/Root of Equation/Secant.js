import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import Desmos from "desmos";
import { addStyles, EditableMathField } from "react-mathquill";
import { compile, derivative } from "mathjs";
const AlgebraLatex = require("algebra-latex");
const math = require("mathjs");

addStyles();

var dataInTable = [];
const columns = [
  {
    title: "Iteration",
    dataIndex: "iteration",
    key: "iteration",
  },
  {
    title: "Y",
    dataIndex: "y",
    key: "y",
  },
  {
    title: "Error",
    key: "error",
    dataIndex: "error",
  },
];

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.bi = this.bi.bind(this);
    this.Ex = this.Ex.bind(this);
    this.fn = this.fn.bind(this);
    this.state = { ans: [], Funtion: "", X0: null, X1: null };
    this.elt = {};
    this.calculator = {};
  }

  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://localhost:8000/Secant";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      Funtion: data.Secant.Funtion,
      X0: data.Secant.X0,
      X1: data.Secant.X1,
    });
    console.log(this.state.X0);
  }

  fn(x) {
    return math.evaluate(this.state.Funtion, { x: x });
  }

  error(xnew, xold) {
    return Math.abs((xnew - xold) / xnew);
  }

  func(Funtion, x) {
    //console.log(this)
    //const algebraObj = new AlgebraLatex().parseLatex(Funtion).toMath()
    // console.log(math.evaluate(algebraObj, { x: x }))
    return math.evaluate(Funtion, { x: x });
  }

  bi() {
    var x0 = Number(this.state.X0);
    var x1 = Number(this.state.X1);
    var func = this.func;
    var error = this.error;
    var x = [],
      y = 0,
      epsilon = parseFloat(0.0);
    var n = 1,
      i = 1;
    var data = [];
    data["y"] = [];
    data["error"] = [];
    x.push(x0);
    x.push(x1);
    data["y"][0] = x0;
    data["error"][0] = "---";

    do {
      y =
        x[i] -
        (func(this.state.Funtion, x[i]) * (x[i] - x[i - 1])) /
          (func(this.state.Funtion, x[i]) - func(this.state.Funtion, x[i - 1]));
      x.push(y);
      epsilon = error(y, x[i]);
      data["y"][n] = y.toFixed(8);
      data["error"][n] = Math.abs(epsilon).toFixed(8);
      n++;
      i++;
      if (n >= 1000) {
        break;
      }
    } while (Math.abs(epsilon) > 0.000001);
    this.createTable(data["y"], data["error"]);
  }

  createTable(y, error) {
    dataInTable = [];
    for (var i = 0; i < y.length; i++) {
      dataInTable.push({
        iteration: i + 1,
        y: y[i],
        error: error[i],
      });
    }
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        <h1>Secant</h1>
        <div className="row">
          <div className="col">
            <div>
              <p>Funtion</p>
              <Input
                onChange={(e) => {
                  this.setState({ Funtion: e.target.value });
                  this.forceUpdate();
                  // console.log(this.state.Funtion);
                }}
                value={this.state.Funtion}
                name="Funtion"
                placeholder="Funtion"
              />
              <br></br>
              <br></br>
              <Input
                onChange={(e) => {
                  this.setState({ X0: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.X0}
                name="X0"
                placeholder="X0"
              />
              <br></br>
              <br></br>
              <Input
                onChange={(e) => {
                  this.setState({ X1: e.target.value });
                  this.forceUpdate();
                }}
                value={this.state.X1}
                name="X1"
                placeholder="X1"
              />
              <br></br>
              <br></br>
              <Button onClick={this.bi}>Submit</Button>
              <Button
                style={{
                  marginLeft: "70%",
                  backgroundColor: "#F0B27A",
                  borderColor: "#F0B27A",
                }}
                onClick={this.Ex}
                type="primary"
              >
                Example
              </Button>
            </div>
            <br></br>
          </div>
        </div>
        <br></br>
        <br></br>
        {/* {this.state.ans.map((data, i) => {
          return (
            <p>
              Iteration No.{i + 1} Root of equation is {data}
            </p>
          );
        })} */}
        <Card
          title={"Output"}
          bordered={true}
          style={{
            width: "100%",
            background: "#F0B27A",
            color: "#FFFFFFFF",
          }}
          id="outputCard"
        >
          <Table
            pagination={{ defaultPageSize: 5 }}
            columns={columns}
            dataSource={dataInTable}
            bodyStyle={{
              fontWeight: "bold",
              fontSize: "18px",
              color: "black",
            }}
          ></Table>
        </Card>
      </div>
    );
  }
}
