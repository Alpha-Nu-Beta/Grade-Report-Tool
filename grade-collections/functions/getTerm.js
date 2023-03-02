function getTerm(data, termSelect) {
  var fallIndex = data.indexOf(termSelect);
  var springIndex = data.indexOf("2023Spring");
  var term = data.substring(
    fallIndex,
    springIndex > -1 ? springIndex : data.length - 1
  );
  return term;
}

module.exports = getTerm;
