import React from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {techniciansOptions} from "../../utils/constants";
import {getCurrentPayPerMonth, getDataByEntityId, parseEntities} from "../../utils/parser";

class PaymentReports extends React.Component {
  state = {
    contractorId: 0,
    year: 2019,
    originalData: [],
    data: null,
    dataLoadStatus: false,
    availableOptions: techniciansOptions,
    selectedOption: techniciansOptions[0],
    selectedPaymentType: 2
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
    this.setState({ data, dataLoadStatus: true, originalData: newData });
  };

  getPaymentReport = () => {
    const { contractorId, year, selectedPaymentType } = this.state,
      token = getCurrentUser().sessionToken;
    firefighterAPI
      .get(`/api/report/payment${selectedPaymentType}?id=${contractorId}&year=${year}&filetype=0`, {
        headers: {
          SessionToken: token
        }
      })
      .then((response) => {
        console.log(response.data)
        console.log(parseEntities(response.data.pays.data))
        const firstEntity = parseEntities(response.data.pays.data)[0],
              data = getCurrentPayPerMonth(getDataByEntityId(response.data, firstEntity.id));
        console.log(getCurrentPayPerMonth(getDataByEntityId(response.data, firstEntity.id)))
        this.setState({ data, dataLoadStatus: true });
        // this.setChartData(response.data.data, selectedOption);
      })
      .catch(error => {
        if (error.response){
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        }else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
  };

  render() {
    const {dataLoadStatus, data, beginDate, endDate, availableOptions} = this.state;
    if (!data) this.getPaymentReport();
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

export default PaymentReports;