function getStudentID(data) {
  var studentID = data.substring(
    data.indexOf("Student ID") + 14,
    data.indexOf("Student ID") + 22
  );
  return parseInt(studentID);
}

module.exports = getStudentID;
