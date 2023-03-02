function getStudentName(data) {
  var name = data.substring(
    data.indexOf("Name:") + 16,
    data.indexOf("Student ID") - 1
  );
  return name;
}

module.exports = getStudentName;
