import React from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {techniciansOptions} from "../../utils/constants";

import "./reports.scss";
import "react-datepicker/dist/react-datepicker.css";

class Reports extends React.Component {

  state = {
    beginDate: new Date('2020-04-01'),
    endDate: new Date('2020-05-31'),
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

  handleBeginDateChange = date => {
    this.setState({ beginDate: date});
  };

  handleEndDateChange = date => {
    this.setState({ endDate: date});
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedOption, originalData, beginDate, endDate } = this.state;
    if (selectedOption !== prevState.selectedOption) {
      this.setChartData(originalData, selectedOption);
    }
    if (beginDate !== prevState.beginDate || endDate !== prevState.endDate) {
      this.getTechnicians();
    }
  }

  setChartData = (newData, option) => {
    const data = [['Техник', option.name]];
    newData.forEach(element => data.push([element.name, element[option.key]]));
    console.log('data:', data)
    this.setState({ data, dataLoadStatus: true, originalData: newData });
  };

  getTechnicians = () => {
    const { beginDate, endDate, selectedOption } = this.state,
      token = getCurrentUser().sessionToken,
      date1 = beginDate.getTime(),
      date2 = endDate.getTime();
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
    const { data, dataLoadStatus, availableOptions, beginDate, endDate } = this.state;
    if (!data.length) this.getTechnicians();
    return (
      <div>
        <ReportsNavbar
          history={ this.props.history }
          getTechnicians={ this.getTechnicians }
        />
        { dataLoadStatus &&
          <div className="chart-wrapper">
            <Chart
            width={'1000px'}
            height={'600px'}
            chartType={"ColumnChart"}
            data={data}
            />
            <div>
              <ChartOptionSelector updateSelectedOption={ this.updateSelectedOption } options={availableOptions} />
              <div>
                <label>Начальная дата: </label>
                <DatePicker selected={beginDate} onChange={this.handleBeginDateChange}/>
              </div>
              <div>
                <label>Конечная дата: </label>
                <DatePicker selected={endDate} onChange={this.handleEndDateChange}/>
              </div>
            </div>
          </div>
        }
        { !dataLoadStatus && <div className="chart-wrapper">Загружаем данные</div> }
      </div>
    );
  }
}

export default Reports;