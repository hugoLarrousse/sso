// convert string to boolean
const convertStringToBoolean = (str: (string | boolean | undefined)) => {
  if (!str) return false;
  if (typeof str === 'boolean') return str;

  return ['false', 'undefined', 'null', ''].includes(str) ? false : !!str;
};

export {
  convertStringToBoolean,
}
