import React from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {techniciansOptions} from "../../utils/constants";

class PaymentReports extends React.Component {
  state = {
    beginDate: new Date('2020-04-01'),
    endDate: new Date('2020-05-31'),
    originalData: [],
    data: [],
    dataLoadStatus: false,
    availableOptions: techniciansOptions,
    selectedOption: techniciansOptions[0]
  };

  render() {
    const {dataLoadStatus, data, beginDate, endDate, availableOptions} = this.state;
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

export default PaymentReports;