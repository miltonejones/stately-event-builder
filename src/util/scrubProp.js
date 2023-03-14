
const keys = {
  '&amp;': '&',
  '&apos;': "'"
}

export const scrubProp = str => {
  Object.keys(keys).map(key => {
    while(str.indexOf(key) > 0) {
      str = str.replace(key, keys[key]);
    }
    return key;
  })
  return str;
}
