export function parseEntities(data) {
  return data.map(entity => ({ key: entity.id, name: entity.title }));
}

export function getCurrentPayPerMonth(responseData, id) {
  const data = getDataByEntityId(responseData, id),
        response = [['Месяц', 'Оплата по счету']],
        rows = data.reduce((array, month) => {
          const result = month.map(payment => [
            new Date(payment.reglamentDate.timeInMS).toLocaleDateString('ru', { month: 'long', day: 'numeric' }),
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
