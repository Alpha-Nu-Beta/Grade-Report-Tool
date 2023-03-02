function getCUMGPA(data) {
  var cum = data.substring(data.indexOf("Undergraduate Career Totals") + 27);
  cumGPA = cum.substring(9, cum.indexOf("Cum Totals"));
  return parseFloat(cumGPA);
}

module.exports = getCUMGPA;
