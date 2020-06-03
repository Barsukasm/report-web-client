export function parseEntities(data) {
  return data.map(entity => ({ id: entity.id, title: entity.title }));
}

export function getCurrentPayPerMonth(data) {
  console.log('data in getCurrentPayPerMonth: ', data)
  const response = [['Месяц', 'Оплата по счету - выставлена']],
        rows = data.map(element => [
          new Date(element[0].reglamentDate.timeInMS).toLocaleDateString('ru', { month: 'long' }),
          element[0].currentPay
        ]);
  return response.concat(rows);
}

export function getDataByEntityId(data, id) {
  const index = data.pays.data.findIndex(element => element.id === id);
  return data.pays.data[index].data[0].data
}