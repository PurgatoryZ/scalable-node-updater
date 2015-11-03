var JSONValidation  = require('json-validation').JSONValidation;

var jv = new JSONValidation();

var schema = {
    'type': 'object',
    'properties': {
        'type': { 'type': 'string', 'required': true},
        'destination': { 'type': 'any', 'required': true},
        'data': {'type': 'object', 'required': true}
    }
};

var Validate = {
  check: function(message) {
      if (typeof message === 'string') {
          message = JSON.parse(message);
      }
      return message && jv.validate(message, schema).ok;
  }
};

module.exports = Validate;