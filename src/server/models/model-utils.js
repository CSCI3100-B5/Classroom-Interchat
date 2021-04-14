function filterSafeOrOriginal(model) {
  if (!model) return model;
  if (model.filterSafe) return model.filterSafe();
  if (model instanceof Array) {
    if (model.some(x => !x.filterSafe)) return model;
    return model.map(x => x.filterSafe());
  }
  return model;
}

module.exports = {
  filterSafeOrOriginal
};
