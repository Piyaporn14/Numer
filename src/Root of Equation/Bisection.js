import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Input, Button, Table } from "antd";
import { addStyles } from "react-mathquill";
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
    title: "XL",
    dataIndex: "xl",
    key: "xl",
  },
  {
    title: "XR",
    dataIndex: "xr",
    key: "xr",
  },
  {
    title: "X",
    dataIndex: "x",
    key: "x",
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
    this.state = { ans: [], Funtion: "", XL: null, XR: null };
    this.elt = {};
    this.calculator = {};
  }

  //API
  async Ex() {
    // const url = "https://api.randomuser.me/";
    const url = "http://localhost:8000/Bisection";
    // const url = "http://127.0.0.1/Json/item.json";
    const response = await fetch(url);
    console.log(response);
    const data = await response.json();
    console.log(data);
    this.setState({
      Funtion: data.Bisection.Funtion,
      XL: data.Bisection.XL,
      XR: data.Bisection.XR,
    });
  }

  fn(x) {
    return math.evaluate(this.state.Funtion, { x: x });
  }

  bi() {
    var fn = this.fn;
    console.log(fn);
    var data = [];
    data["xl"] = [];
    data["xr"] = [];
    data["x"] = [];
    data["error"] = [];

    var xl = Number(this.state.XL);
    var xr = Number(this.state.XR);
    var xmn,
      xmo,
      eps = 0.00001,
      time = 0;
    var ans = [];

    xmn = (xl + xr) / 2;
    if (fn(xmn) * fn(xr) > 0) {
      xr = xmn;
    } else if (fn(xmn) * fn(xr) < 0) {
      xl = xmn;
    } else {
      console.log("Iteration No. = " + time);
      console.log("Root of equation is " + xmn.toFixed(6));
      // ans.push(xmn.toFixed(6));
      data["xl"][time] = xl;
      data["xr"][time] = xr;
      data["x"][time] = xmn.toFixed(6);
      data["error"][time] = Math.abs(err).toFixed(6);
      this.createTable(data["xl"], data["xr"], data["x"], data["error"]);
      this.forceUpdate();
      return;
    }
    data["xl"][0] = xl;
    data["xr"][0] = xr;
    data["x"][0] = xmn.toFixed(6);
    data["error"][0] = Math.abs(err).toFixed(6);
    while (true) {
      if (time >= 1000) {
        console.log("break");
        break;
      }
      time++;
      xmo = xmn;
      xmn = (xl + xr) / 2;
      if (fn(xmn) * fn(xr) > 0) {
        xr = xmn;
      } else if (fn(xmn) * fn(xr) < 0) {
        xl = xmn;
      } else {
        // console.log("Root of equation is " + xmn);
        break;
      }
      var err = Math.abs((xmn - xmo) / xmn);
      if (err <= eps) {
        break;
      }
      data["xl"][time] = xl;
      data["xr"][time] = xr;
      data["x"][time] = xmn.toFixed(6);
      data["error"][time] = Math.abs(err).toFixed(6);

      console.log("Iteration No. = " + time);
      console.log("Root of equation is " + xmn.toFixed(6));
    }
    console.log("Iteration No. = " + time);
    console.log("Root of equation is " + xmn.toFixed(6));

    data["xl"][time] = xl;
    data["xr"][time] = xr;
    data["x"][time] = xmn.toFixed(6);
    data["error"][time] = Math.abs(err).toFixed(6);

    this.createTable(data["xl"], data["xr"], data["x"], data["error"]);
    this.setState({ ans: ans });
    // console.log(fn(2));
    this.forceUpdate();
  }

  createTable(xl, xr, x, error) {
    dataInTable = [];
    for (var i = 0; i < xl.length; i++) {
      dataInTable.push({
        iteration: i + 1,
        xl: xl[i],
        xr: xr[i],
        x: x[i],
        error: error[i],
      });
    }
  }

  render() {
    return (
      <div>
        <h1>Bisection</h1>
        <div className="row">
          <div className="col">
            <div>
              <p>Funtion</p>
              <Input
                onChange={(e) => {
                  this.setState({ Funtion: e.target.value });
                }}
                value={this.state.Funtion}
                name="Funtion"
                placeholder="Funtion"
              />
              <br></br>
              <br></br>
              <p>XL</p>
              <Input
                onChange={(e) => {
                  this.setState({ XL: e.target.value });
                  // console.log("HIII");
                }}
                value={this.state.XL}
                name="XL"
                placeholder="XL"
              />
              <p>XR</p>
              <Input
                onChange={(e) => {
                  this.setState({ XR: e.target.value });
                }}
                value={this.state.XR}
                name="XR"
                placeholder="XR"
              />
              <br></br>
              <br></br>
              <Button onClick={this.bi}>Submit</Button>
              <Button
                style={{
                  marginLeft: "10%",
                  backgroundColor: "#D35400",
                  borderColor: "#D35400",
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
            color: "#F0B27A",
          }}
          id="outputCard"
        >
          <Table
            pagination={{ defaultPageSize: 10 }}
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
