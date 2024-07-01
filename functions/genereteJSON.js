const genereteJSON = (status, code, dataKey, valueKey) => ({
  status,
  code,
  data: { [dataKey]: valueKey },
});

module.exports = genereteJSON;
