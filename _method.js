module.exports = {
  startPage: String,
  nextPage: Function, // context => {}
  goToPages: {
    path: String,
    items: [
      {
        type: String,
        data: {
          propertyName: {
            path: String,
            getFirst: Boolean,
            value: Function // context => {}
            // isId: Boolean
          }
        },
        processItem: Function // (item, context) => {}
      }
    ]
  }
}
