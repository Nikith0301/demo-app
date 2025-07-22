export function buildCustomerFilter(filter: any) {
  const cond: any = {};
  if (filter.leadName) cond.name = { contains: filter.leadName, mode: 'insensitive' };
  if (filter.leadPhone) cond.phone = filter.leadPhone;
  if (filter.leadStatus) cond.lead_status = filter.leadStatus;
  if (filter.leadSource) cond.source = filter.leadSource;
  if (filter.leadEmail) cond.email = filter.leadEmail;
  return cond;
}

export function buildOrderFilter(filter: any) {
  const cond: any = {};
  if (filter.orderStatus) cond.status = filter.orderStatus;
  if (filter.orderAmountLt) cond.totalAmount = { lt: filter.orderAmountLt };
  return cond;
}

export function buildServiceFilter(filter: any) {
  const cond: any = {};
  if (filter.serviceName) cond.name = { contains: filter.serviceName, mode: 'insensitive' };
  if (filter.serviceAmountLt) cond.totalAmount = { lt: filter.serviceAmountLt };
  return cond;
}

export function buildSubServiceFilter(filter: any) {
  const cond: any = {};
  if (filter.amountGte) cond.amount = { gte: filter.amountGte };
  if (filter.nameContains) cond.name = { contains: filter.nameContains, mode: 'insensitive' };
  return cond;
}
