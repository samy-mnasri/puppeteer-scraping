module.exports = async ({ options, puppeteer, method }) => {
  const context = {}

  const browser = await puppeteer.launch(options)
  context.page = await browser.newPage()
  let nextPage

  do {
    await context.page.goto(nextPage || method.startPage)
    const urls = []
    const urlElements = await context.page.$x(method.goToPages.path)

    for (const urlElement of urlElements) {
      urls.push(await (await urlElement
        .getProperty('textContent'))
        .jsonValue())
    }

    for (const url of urls) {
      await context.page.goto(url)

      for (const itemMethod of method.goToPages.items) {
        let item = {}

        for (const property in itemMethod.data) {
          if (itemMethod.data[property].value) {
            item[property] = await itemMethod.data[property].value(context)
          } else {
            const values = []

            const elements = await context.page
              .$x(itemMethod.data[property].path)

            for (const element of elements) {
              values.push(
                await (await element
                  .getProperty('textContent'))
                  .jsonValue()
              )
            }

            if (itemMethod.data[property].getFirst) {
              item[property] = values[0]
            } else {
              item[property] = values
            }
          }
        }

        item = (await itemMethod.processItem(item, context)) || item

        if (context.items[itemMethod.type]) {
          context.items[itemMethod.type].push(item)
        } else {
          context.items[itemMethod.type] = [item]
        }
      }
    }

    nextPage = await method.nextPage(context)
  } while (nextPage)

  await browser.close()
  return context
}
