const utils = {};

utils.parseError = function (errors) {
  var parsed = {};
  if (errors.name == "ValidationError") {
    for (var name in errors.errors) {
      var validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message: "이미 사용 중인 사용자 명입니다" };
  } else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
};

module.exports = utils;
