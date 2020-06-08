import React from "react";

import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";

import firefighterAPI from "../../api/firefighter-api";
import ReportsNavbar from "../reports-navbar";
import {getCurrentUser} from "../../utils/user-authorization";
import ChartOptionSelector from "../chart-option-selector";
import {getCurrentDebtPerMonth, parseEntities} from "../../utils/parser";

import "react-datepicker/dist/react-datepicker.css";
import {debtReportTypeOptions} from "../../utils/constants";

class DebtReports extends React.Component {
  state = {
    contractorId: 0,
    beginDate: new Date('2018'),
    endDate: new Date(),
    originalData: [],
    data: null,
    dataLoadStatus: false,
    availableOptions: [],
    selectedOption: null,
    debtTypes: debtReportTypeOptions,
    selectedDebtType: debtReportTypeOptions[0],
    integrate: false
  };

  updateSelectedOption = option => {
    this.setState({
      selectedOption: option
    });
  };

  updateDebtType = option => {
    this.setState({
      selectedDebtType: option
    });
  };

  handleBeginDateChange = date => {
    this.setState({ beginDate: date, dataLoadStatus: false});
  };

  handleEndDateChange = date => {
    this.setState({ endDate: date, dataLoadStatus: false});
  };

  handleIntegrateChange = () => {
    this.setState(initialState => ({ integrate: !initialState.integrate }));
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { selectedOption, originalData, year, selectedDebtType, integrate } = this.state;
    if (selectedOption !== prevState.selectedOption) {
      this.setChartData(originalData, selectedOption);
    }
    if (year !== prevState.year || selectedDebtType !== prevState.selectedDebtType || integrate !== prevState.integrate) {
      this.setState({ dataLoadStatus: false });
      this.getDebtReport();
    }
  }

  setChartData = (newData, option) => {
    const data = getCurrentDebtPerMonth(newData, option.key);
    this.setState({ data, dataLoadStatus: true, originalData: newData });
  };

  getDebtReport = () => {
    const { contractorId, beginDate, endDate, selectedDebtType, integrate } = this.state,
      token = getCurrentUser().sessionToken,
      date1 = beginDate.getTime(),
      date2 = endDate.getTime();
    firefighterAPI
      .get(`/api/report/dept/${selectedDebtType.key}?id=${contractorId}&integrate=${integrate}&dateInMS1=${date1}&dateInMS2=${date2}&filetype=0`, {
        headers: {
          SessionToken: token
        }
      })
      .then((response) => {
        // console.log('response: ', response)
        const entities = parseEntities(response.data.data.data),
              data = getCurrentDebtPerMonth(response.data, entities[0].key);
        // console.log('entities: ', entities)
        // console.log('data: ', data)
        this.setState({
          data,
          dataLoadStatus: true,
          availableOptions: entities,
          selectedOption: entities[0],
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
    const { dataLoadStatus, data, beginDate, endDate, availableOptions, selectedDebtType, debtTypes, integrate } = this.state;
    if (!data) this.getDebtReport();
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
                slantedText: false
              }
            }}
          />
          }
          { !dataLoadStatus && <div className="chart-wrapper">Загружаем данные</div> }
          <div>
            <label>Начальная дата: </label>
            <DatePicker
              selected={beginDate}
              locale="ru"
              dateFormat="dd.MM.yyyy"
              onChange={this.handleBeginDateChange}
              disabled={!dataLoadStatus}/>
          </div>
          <div>
            <label>Конечная дата: </label>
            <DatePicker
              selected={endDate}
              locale="ru"
              dateFormat="dd.MM.yyyy"
              onChange={this.handleEndDateChange}
              disabled={!dataLoadStatus}/>
          </div>
          { availableOptions && dataLoadStatus &&
          <div>
            <label>{selectedDebtType.name}:</label>
            <ChartOptionSelector
              updateSelectedOption={ this.updateSelectedOption }
              options={ availableOptions }
            />
          </div>
          }
          <Form>
            <Form.Check
              type={'checkbox'}
              label={'Нарастающим итогом'}
              checked={integrate}
              onChange={ this.handleIntegrateChange }
            />
          </Form>
          <div>
            <label>Категория:</label>
            <ChartOptionSelector
              updateSelectedOption={ this.updateDebtType }
              options={ debtTypes }
              disabled={!dataLoadStatus}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default DebtReports;