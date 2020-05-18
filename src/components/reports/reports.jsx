import React from "react";
import { Chart } from "react-google-charts";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {techniciansOptions} from "../../utils/constants";

import "./reports.scss";

class Reports extends React.Component {

  state = {
    beginDate: '2020-04-01',
    endDate: '2020-05-31',
    originalData: [],
    data: [],
    dataLoadStatus: false,
    availableOptions: techniciansOptions,
    selectedOption: techniciansOptions[0]
  };

  updateSelectedOption = option => {
    this.setState({
      selectedOption: option
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedOption, originalData } = this.state;
    if (selectedOption !== prevState.selectedOption) {
      this.setChartData(originalData, selectedOption);
    }
  }

  setChartData = (newData, option) => {
    const data = [['Техник', option.name]];
    newData.forEach(element => data.push([element.name, element[option.key]]));
    this.setState({ data, dataLoadStatus: true, originalData: newData });
  };

  getTechnicians = () => {
    const { beginDate, endDate, selectedOption } = this.state,
      token = getCurrentUser().sessionToken,
      date1 = new Date(beginDate).getTime(),
      date2 = new Date(endDate).getTime();
    firefighterAPI
      .get(`/api/report/technicians?timeInMS1=${date1}&timeInMS2=${date2}&filetype=0`, {
        headers: {
          SessionToken: token
        }
      })
      .then((response) => {
        this.setChartData(response.data.data, selectedOption);
      })
      .catch(reason => console.log(reason));
  };

  render() {
    const { data, dataLoadStatus, availableOptions } = this.state;
    if (!data.length) this.getTechnicians();
    return (
      <div>
        <ReportsNavbar
          history={ this.props.history }
          getTechnicians={ this.getTechnicians }
        />
        <div className="chart-wrapper">
          { dataLoadStatus &&
            <Chart
            width={'1000px'}
            height={'600px'}
            chartType={"ColumnChart"}
            data={data}
            />
          }
          { dataLoadStatus && <ChartOptionSelector updateSelectedOption={ this.updateSelectedOption } options={availableOptions} /> }
          { !dataLoadStatus && <div>Загружаем данные</div> }
        </div>
      </div>
    );
  }
}

export default Reports;