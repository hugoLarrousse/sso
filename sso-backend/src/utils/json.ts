const safeJSONParse = (json: any, errorReturnType = undefined) => {
  try {
    if (typeof json !== 'string') return json;
    return JSON.parse(json);
  } catch (e) {
    return errorReturnType;
  }
};

// eslint-disable-next-line import/prefer-default-export
export { safeJSONParse };
