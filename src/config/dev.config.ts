
const jwtSecret = 'J]##H@_e+1>xRsZ1XAjUEIjB!OEuzV=):4+.ahwo:l7u#oM}.]U4umqKNnPLpfDn';
const kafkaConfig = {
  servers: 'pkc-4nxnd.asia-east2.gcp.confluent.cloud:9092',
  username: 'FHEQH3N2QHTV5BFX',
  password: 'TaV8UJjAz1C4FIhdhp5dXist4MPsvURCqkOhAFqTSvGNkrhmx1pZOoi7yDSrljyp'
}
const currencyList: string[] = [
  'GBP', 'EUR', 'CHF'
]

export { jwtSecret, kafkaConfig, currencyList }