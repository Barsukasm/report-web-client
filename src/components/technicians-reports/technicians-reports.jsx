import React from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {techniciansOptions} from "../../utils/constants";

import "./technicians-reports.scss";
import "react-datepicker/dist/react-datepicker.css";

registerLocale('ru', ru);

class TechniciansReports extends React.Component {

  state = {
    beginDate: new Date('2020-04-01'),
    endDate: new Date('2020-05-31'),
    originalData: [],
    data: null,
    dataLoadStatus: false,
    availableOptions: techniciansOptions,
    selectedOption: techniciansOptions[0]
  };

  updateSelectedOption = option => {
    this.setState({
      selectedOption: option,
      dataLoadStatus: false
    });
  };

  handleBeginDateChange = date => {
    this.setState({ beginDate: date, dataLoadStatus: false});
  };

  handleEndDateChange = date => {
    this.setState({ endDate: date, dataLoadStatus: false});
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
      .catch(error => {
        if (error.response){
          error.response.status === 401 ? this.props.history.push('/login') : console.log(error.response.status);
          console.log(error.response.data);
          console.log(error.response.headers);
        }else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
      });
  };

  render() {
    const { data, dataLoadStatus, availableOptions, beginDate, endDate } = this.state;
    if (!data) this.getTechnicians();
    return (
      <div>
        <ReportsNavbar
          history={ this.props.history }
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
                <DatePicker selected={beginDate} locale="ru" dateFormat="dd.MM.yyyy" onChange={this.handleBeginDateChange}/>
              </div>
              <div>
                <label>Конечная дата: </label>
                <DatePicker selected={endDate} locale="ru" dateFormat="dd.MM.yyyy" onChange={this.handleEndDateChange}/>
              </div>
            </div>
          </div>
        }
        { !dataLoadStatus && <div className="chart-wrapper">Загружаем данные</div> }
      </div>
    );
  }
}

export default TechniciansReports;