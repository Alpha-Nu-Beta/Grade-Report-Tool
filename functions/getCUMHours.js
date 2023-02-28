function getCUMHours(data) {
  var cum = data.substring(data.indexOf("Undergraduate Career Totals") + 27);
  cumHours = cum.substring(cum.indexOf("Cum Totals") + 10);
  cumHours = cumHours.substring(0, cumHours.indexOf(".") + 4);
  return parseFloat(cumHours);
}

module.exports = getCUMHours;
