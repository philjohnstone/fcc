/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {

  const VALID_UNITS = [
    { unit: 'gal', name: 'gallons', to: 'l' },
    { unit: 'l', name: 'litres', to: 'gal' },
    { unit: 'mi', name: 'miles', to: 'km' },
    { unit: 'km', name: 'kilometers', to: 'mi' },
    { unit: 'lbs', name: 'pounds', to: 'kg' },
    { unit: 'kg', name: 'kilograms', to: 'lbs' },
  ];
  
  this.splitInput = function(input) {
    var match = input.match(/[a-zA-Z]/gi);
    var unitIndex = input.indexOf(match[0]);
    var unit = input.substring(unitIndex, input.length);
    var unitsValid = VALID_UNITS.filter((validUnit) => unit.toLowerCase() === validUnit.unit).length == 1;
    if (!unitsValid) {
      unit = 'invalid unit';
    }
    var stringNumber = input.substring(0, unitIndex);
    var fractionSplit = stringNumber.split('\/');
    if (unitIndex === 0) {
      return { number: 1, unit};
    }
    if (fractionSplit.length > 2) {
      return { number: 'invalid number', unit };
    }
    var number = fractionSplit.length === 1 ? 
      parseFloat(stringNumber) :
      parseFloat(fractionSplit[0]) / parseFloat(fractionSplit[1]);
    return { number, unit };
  }

  this.getNum = function(input) {
    return this.splitInput(input).number;
  };
  
  this.getUnit = function(input) {
    return this.splitInput(input).unit;
  };
  
  this.getReturnUnit = function(initUnit) {
    var foundUnit = VALID_UNITS.filter((validUnit) => initUnit.toLowerCase() === validUnit.unit);
    if (foundUnit.length != 1) {
      return 'invalid unit';
    }
    return foundUnit[0].to;
  };

  this.spellOutUnit = function(unit) {
    var foundUnit = VALID_UNITS.filter((validUnit) => unit.toLowerCase() === validUnit.unit);
    if (foundUnit.length != 1) {
      return 'invalid unit';
    }
    return foundUnit[0].name;
  };
  
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    switch (initUnit.toLowerCase()) {
      case 'gal':
        return initNum * galToL;
      case 'l':
        return initNum / galToL;
      case 'lbs':
        return initNum * lbsToKg;
      case 'kg':
        return initNum / lbsToKg;
      case 'mi':
        return initNum * miToKm;
      case 'km':
        return initNum / miToKm;
    }
    return 'invalid unit';
  };
  
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return initNum + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum + ' ' + this.spellOutUnit(returnUnit);
  };
  
}

module.exports = ConvertHandler;

