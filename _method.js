module.exports = {
  firstPage: String,
  nextPage: Function,
  pages: {
    path: String,
    items: {
      name: { path: String }
    },
    processItems: Function
  }
}
