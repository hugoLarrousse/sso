const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/\s/g, '-');
}

export {
  normalizeString,
}