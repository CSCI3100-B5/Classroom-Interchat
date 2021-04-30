/**
 * Return model.filterSafe() or the model itself
 * Calls filterSafe for each element in the array if the provided model is an array
 * @param {import('mongoose').Model|import('mongoose').Model[]} model the database model
 * @returns the model itself or a filtered version of it
 */
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
