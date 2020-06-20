export function parseEntities(data) {
  return data.map(entity => ({ key: entity.id, name: entity.title }));
}

export function getCurrentPayPerMonth(responseData, id) {
  const data = getDataByEntityId(responseData, id),
        response = [['Месяц', 'Оплата по счету']],
        rows = data.reduce((array, month) => {
          const result = month.map(payment => [
            new Date(payment.reglamentDate.timeInMS).toLocaleDateString('ru', { month: 'long' }),
            payment.currentPay
          ]);
          return array.concat(result);
        }, []);
  return response.concat(rows);
}

export function getDataByEntityId(data, id) {
  const index = data.pays.data.findIndex(element => element.id === id);
  return data.pays.data[index].data[0].data
}

export function getCurrentDebtPerMonth(responseData, id) {
  const data = getDebtsByEntityId(responseData, id),
    response = [['Месяц', 'Задолжность']],
    rows = data.map(debt => [
      new Date(debt.year, debt.month).toLocaleDateString('ru', { month: 'long', year: 'numeric' }),
      debt.sum
    ]);
  return response.concat(rows);
}

function getDebtsByEntityId(data, id) {
  const index = data.data.data.findIndex(entity => entity.id === id);
  return data.data.data[index].data;
}