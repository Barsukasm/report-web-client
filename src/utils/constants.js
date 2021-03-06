export const techniciansOptions = [
  {name: 'Количество смен', key: 'shiftCount'},
  {name: 'Кол-во смен без заявок', key: 'emptyShiftCount'},
  {name: 'Кол-во заявок', key: 'mainCount'},
  {name: 'Кол-во заявок в плане', key: 'mainCountInPlan'},
  {name: 'Кол-во заявок выполненных', key: 'mainCountDone'},
  {name: 'Кол-во заявок выполненных частично или перенесенных', key: 'mainCountFail'},
  {name: 'Кол-во заявок в процессе выполнения', key: 'mainCountProc'},
  {name: 'Кол-во работ', key: 'jobCount'},
  {name: 'Кол-во работ в плане', key: 'jobCountInPlan'},
  {name: 'Кол-во работ выполненных', key: 'jobCountDone'},
  {name: 'Кол-во работ с проблемами', key: 'jobCountFail'},
  {name: 'Кол-во заявок в процессе выполнения', key: 'jobCountProc'},
  {name: 'Общее время заявок (выполненных)', key: 'mainTimeInMin'},
  {name: 'Общее время работ (выполненных)', key: 'jobTimeInMin'},
  {name: 'Время по плану', key: 'totalMainTime'},
  {name: 'Актов передать', key: 'wcrSendToContractor'},
  {name: 'Актов забрать', key: 'wcrOnSubScribe'},
  {name: 'Актов у техника', key: 'wcrByTechnician'},
  {name: 'Кол-во переадресованных звонков', key: 'voiceCallTechnician'},
  {name: 'Собственный ответ', key: 'voiceCallCount'},
  {name: 'Без выезда', key: 'voiceOnlyCall'},
  {name: 'Продолжительность ответа (сумма)', key: 'voiceCallSum'},
  {name: 'Время от голосовой до разовой (план)', key: 'voicePlanSum'},
  {name: 'Время от голосовой до разовой (факт)', key: 'voiceRealSum'},
  {name: 'Голосовые перенесены', key: 'voiceFailCount'},
  {name: 'Выполнено', key: 'voiceDoneCount'},
  {name: 'Всего по голосовым', key: 'voiceTotalCount'},
  {name: 'Голосовые обслуженные', key: 'voiceRealCount'}
];

export const paymentTypeOptions = [
  { name: "Контрагенты", key: 2 },
  { name: "Техники", key: 3 },
  { name: "Обслуживающие организации", key: 4 }
];

export const debtReportTypeOptions = [
  { name: "Контрагенты", key: "cotractor" },
  { name: "Техники", key: "technician" },
  { name: "Обслуживающие организации", key: "service" }
];
