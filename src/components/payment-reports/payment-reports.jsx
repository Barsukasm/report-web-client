import React from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {getCurrentPayPerMonth, parseEntities} from "../../utils/parser";

import "react-datepicker/dist/react-datepicker.css";
import {paymentTypeOptions} from "../../utils/constants";

class PaymentReports extends React.Component {
  state = {
    contractorId: 0,
    year: new Date(),
    originalData: [],
    data: null,
    dataLoadStatus: false,
    availableOptions: [],
    selectedOption: null,
    paymentTypes: paymentTypeOptions,
    selectedPaymentType: paymentTypeOptions[0]
  };

  updateSelectedOption = option => {
    this.setState({
      selectedOption: option
    });
  };

  updatePaymentType = option => {
    this.setState({
      selectedPaymentType: option
    });
  };

  handleYearChange = date => {
    this.setState({ year: date});
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedOption, originalData, year, selectedPaymentType } = this.state;
    if (selectedOption !== prevState.selectedOption) {
      this.setChartData(originalData, selectedOption);
    }
    if (year !== prevState.year || selectedPaymentType !== prevState.selectedPaymentType) {
      this.setState({ dataLoadStatus: false });
      this.getPaymentReport();
    }
  }

  setChartData = (newData, option) => {
    const data = getCurrentPayPerMonth(newData, option.key);
    this.setState({ data, dataLoadStatus: true, originalData: newData });
  };

  getPaymentReport = () => {
    const { contractorId, year, selectedPaymentType } = this.state,
      token = getCurrentUser().sessionToken;
    firefighterAPI
      .get(
        `/api/report/payment${selectedPaymentType.key}?id=${contractorId}&year=${year.getFullYear()}&filetype=0`,
        {
          headers: {
            SessionToken: token
          }
        }
      )
      .then((response) => {
        const options = parseEntities(response.data.pays.data),
              data = getCurrentPayPerMonth(response.data, options[0].key);
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
          error.response.status === 401 ? this.props.history.push('/login') : console.log(error.response.status);
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
    const { dataLoadStatus, data, year, availableOptions, selectedPaymentType, paymentTypes } = this.state;
    if (!data) this.getPaymentReport();
    return (
      <div>
        <ReportsNavbar
          history={ this.props.history }
        />
        <div className="chart-wrapper">
          { dataLoadStatus &&
          <Chart
            width={'1000px'}
            height={'600px'}
            chartType={"ColumnChart"}
            data={data}
            options={{
              hAxis: {
                minTextSpacing: 20,
                slantedText: false,
                maxAlternation: 1
              }
            }}
          />
          }
          { !dataLoadStatus && <div className="chart-wrapper">Загружаем данные</div> }
          <div>
            <label>Год: </label>
            <DatePicker
              selected={year}
              onChange={this.handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              disabled={!dataLoadStatus}
            />
          </div>
          { availableOptions && dataLoadStatus &&
          <div>
            <label>{selectedPaymentType.name}:</label>
            <ChartOptionSelector
              updateSelectedOption={ this.updateSelectedOption }
              options={ availableOptions }
            />
          </div>
          }
          <div>
            <label>Категория:</label>
            <ChartOptionSelector
              updateSelectedOption={ this.updatePaymentType }
              options={ paymentTypes }
              disabled={!dataLoadStatus}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PaymentReports;