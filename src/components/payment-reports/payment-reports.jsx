import React from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {getCurrentPayPerMonth, getDataByEntityId, parseEntities} from "../../utils/parser";

import "react-datepicker/dist/react-datepicker.css";

class PaymentReports extends React.Component {
  state = {
    contractorId: 0,
    year: new Date('2020'),
    originalData: [],
    data: null,
    dataLoadStatus: false,
    availableOptions: [],
    selectedOption: null,
    selectedPaymentType: 2
  };

  updateSelectedOption = option => {
    this.setState({
      selectedOption: option
    });
  };

  handleYearChange = date => {
    this.setState({ year: date});
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedOption, originalData, year } = this.state;
    if (selectedOption !== prevState.selectedOption) {
      this.setChartData(originalData, selectedOption);
    }
    if (year !== prevState.year) {
      this.getPaymentReport();
    }
  }

  setChartData = (newData, option) => {
    const data = getCurrentPayPerMonth(getDataByEntityId(newData, option.key));
    this.setState({ data, dataLoadStatus: true, originalData: newData });
  };

  getPaymentReport = () => {
    const { contractorId, year, selectedPaymentType } = this.state,
      token = getCurrentUser().sessionToken;
    firefighterAPI
      .get(`/api/report/payment${selectedPaymentType}?id=${contractorId}&year=${year.getFullYear()}&filetype=0`, {
        headers: {
          SessionToken: token
        }
      })
      .then((response) => {
        const options = parseEntities(response.data.pays.data),
              data = getCurrentPayPerMonth(getDataByEntityId(response.data, options[0].key));
        // response.data.pays.data.forEach(entity => {
        //   console.log('entity.title: ', entity.title)
        //   console.log('entity.data.length: ', entity.data.length)
        //   entity.data.length > 1 && console.log('entity.data.length > 1: ', entity.data.length > 1)
        //   getCurrentPayPerMonth(entity.data[0].data)
        // })
        this.setState({
          data,
          dataLoadStatus: true,
          availableOptions: options,
          selectedOption: options[0],
          originalData: response.data
        });
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
    const {dataLoadStatus, data, year, availableOptions} = this.state;
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
            <div>
              <label>Год: </label>
              <DatePicker
                selected={year}
                onChange={this.handleYearChange}
                showYearPicker
                dateFormat="yyyy"
              />
            </div>
            <div>
              <label>Агенты:</label>
              <ChartOptionSelector
                updateSelectedOption={ this.updateSelectedOption }
                options={availableOptions}
              />
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