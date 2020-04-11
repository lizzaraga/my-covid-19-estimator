/* eslint max-len: ["error", { "code": 220 }] */
const periodNormalizer = ({ periodType, timeToElapse }) => {
  let multiplier;
  switch (periodType) {
    case 'weeks':
      multiplier = 7;
      break;
    case 'months':
      multiplier = 30;
      break;
    default:
      multiplier = 1;
  }
  return timeToElapse * multiplier;
};

const getHospitalBedsByRequestedTime = (severeCasesByRequestedTime, totalHospitalBeds) => parseInt((totalHospitalBeds * 0.35) - severeCasesByRequestedTime, 10);

const getDollarsInFlight = (infectionsByRequestedTime, { avgDailyIncomeInUSD, avgDailyIncomePopulation }, days) => parseInt((infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD) / days, 10);

const covid19ImpactEstimator = (data) => {
  const result = { data, impact: {}, severeImpact: {} };
  const days = periodNormalizer(data);
  const factor = parseInt(days / 3, 10);
  // currentlyInfected
  result.impact.currentlyInfected = parseInt(data.reportedCases * 10, 10);
  result.severeImpact.currentlyInfected = parseInt(data.reportedCases * 50, 10);

  // infectionsByRequestedTime
  result.impact.infectionsByRequestedTime = result.impact.currentlyInfected * 2 ** factor;
  result.severeImpact.infectionsByRequestedTime = result.severeImpact.currentlyInfected * 2 ** factor;

  // severeCasesByRequestedTime
  result.impact.severeCasesByRequestedTime = parseInt(result.impact.infectionsByRequestedTime * 0.15, 10);
  result.severeImpact.severeCasesByRequestedTime = parseInt(result.severeImpact.infectionsByRequestedTime * 0.15, 10);

  // hospitalBedsByRequestedTime
  result.impact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(result.impact.severeCasesByRequestedTime, data.totalHospitalBeds);
  result.severeImpact.hospitalBedsByRequestedTime = getHospitalBedsByRequestedTime(result.severeImpact.severeCasesByRequestedTime, data.totalHospitalBeds);

  // casesForICUByRequestedTime
  result.impact.casesForICUByRequestedTime = parseInt(result.impact.infectionsByRequestedTime * 0.05, 10);
  result.severeImpact.casesForICUByRequestedTime = parseInt(result.severeImpact.infectionsByRequestedTime * 0.05, 10);

  // casesForICUByRequestedTime
  result.impact.casesForICUByRequestedTime = parseInt(result.impact.infectionsByRequestedTime * 0.05, 10);
  result.severeImpact.casesForICUByRequestedTime = parseInt(result.severeImpact.infectionsByRequestedTime * 0.05, 10);

  // casesForVentilatorsByRequestedTime
  result.impact.casesForVentilatorsByRequestedTime = parseInt(result.impact.infectionsByRequestedTime * 0.02, 10);
  result.severeImpact.casesForVentilatorsByRequestedTime = parseInt(result.severeImpact.infectionsByRequestedTime * 0.02, 10);

  // dollarsInFlight
  result.impact.dollarsInFlight = getDollarsInFlight(result.impact.infectionsByRequestedTime, data.region, days);
  result.severeImpact.dollarsInFlight = getDollarsInFlight(result.severeImpact.infectionsByRequestedTime, data.region, days);

  return result;
};

export default covid19ImpactEstimator;
