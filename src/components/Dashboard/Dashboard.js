import React from "react";
import { db } from "../../firebase-config";
import { LineChart, Line, Cell, Bar, Brush, Pie, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, ResponsiveContainer } from 'recharts';
import Logout from "../Logout/Logout";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { dataSet: [], companyCountryData: {} };
  }

  // When the component is mounted:
  componentDidMount() {
    db.collection("data").get()
      .then(nodes => {
        let temp = [];
        let countryCompData = [];
        let reducedArray = [];
        nodes.forEach(node => {
          temp.push(node.data());
          countryCompData.push({
            "Country": node.data().Country, "Company": node.data().Company,
            "Total": node.data().January + node.data().February + node.data().March + node.data().April + node.data().May + node.data().June +
              node.data().July + node.data().August + node.data().September + node.data().October + node.data().November + node.data().December
          });
          reducedArray = countryCompData.reduce((indexSoFar, { Country, Total, Company }) => {
            if (!indexSoFar[Country]) indexSoFar[Country] = [];
            indexSoFar[Country].push({ "Total": Total, "Company": Company });
            return indexSoFar;
          }, {});
        });
        this.setState({ dataSet: temp });
        this.setState({ companyCountryData: reducedArray });
      })
      .catch(error => {
        console.log("Error: ", error);
      });
  }

  componentWillUnmount() {
  }

  RADIAN = Math.PI / 180;
  renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * this.RADIAN);
    const y = cy + radius * Math.sin(-midAngle * this.RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "red", "grey"];

  render() {
    return (
      <div>
        <div style={{display: 'inline-flex'}}>
        <h3 style={{ fontFamily: "Georgia, serif" , width: '1340px', paddingLeft: '5px'}}>Analytica</h3>
        <Logout/>
        </div>
        <hr />
        <h1 style={{ fontFamily: "Georgia, serif" }}>Company Sales Month Wise</h1>
        <hr />
        <BarChart
          width={1400}
          height={750}
          data={this.state.dataSet}
          barSize={50}
          margin={{
            top: 40,
            right: 30,
            left: 40,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Company" />
          <YAxis label={{ value: "Amount ($)", angle: -90, position: 'insideBottomLeft' }} />
          <Tooltip />
          <Legend />
          <Brush dataKey="Company" height={30} stroke="#8884d8" />
          <Bar dataKey="January" fill="red" />
          <Bar dataKey="February" fill="orange" />
          <Bar dataKey="March" fill="blue" />
          <Bar dataKey="April" fill="grey" />
          <Bar dataKey="May" fill="magenta" />
          <Bar dataKey="June" fill="maroon" />
          <Bar dataKey="July" fill="#82ca9d" />
          <Bar dataKey="August" fill="purple" />
          <Bar dataKey="September" fill="skyblue" />
          <Bar dataKey="October" fill="green" />
          <Bar dataKey="November" fill="brown" />
          <Bar dataKey="December" fill="#8884d8" />
        </BarChart>
        <br/>
        <hr></hr>
        <h1 style={{ fontFamily: "Georgia, serif" }}>Country Wise Market Shares</h1>
        <hr></hr>
        <br/>
        <span style={{ display: "inline-flex" }}>
          {Object.keys(this.state.companyCountryData).map(country => {
            return <div key={country}>
              <div style={{ textAlign: "center" }}>{country}</div>
              <PieChart width={300} height={300}>
                <Pie
                  data={this.state.companyCountryData[country]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={this.renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="Total"
                  nameKey="Company"
                  legendType="square"
                >
                  {this.state.companyCountryData[country].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={this.COLORS[index % this.COLORS.length]} />
                  ))}
                </Pie>
                <Legend></Legend>
                <Tooltip />
              </PieChart>
            </div>
          })}
        </span>
        <hr />
      </div>
    );
  }
}

export default Dashboard;