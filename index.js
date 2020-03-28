module.exports = async ({ options, puppeteer, method }) => {
  const context = {}

  const browser = await puppeteer.launch(options)
  context.page = await browser.newPage()
  let nextPage

  do {
    await context.page.goto(nextPage || method.firstPage)
    const urls = []
    const urlElements = await context.page.$x(method.pages)

    for (const urlElement of urlElements) {
      urls.push(await (await urlElement
        .getProperty('textContent'))
        .jsonValue())
    }

    for (const url of urls) {
      await context.page.goto(url)

      for (const item in method.pages.items) {
        context.items[item] = await (await (await context.page
          .$x(method.pages.items[item].path))[0]
          .getProperty('textContent'))
          .jsonValue()
      }

      await method.processItems(context)
    }

    nextPage = await method.nextPage(context)
  } while (nextPage)

  await browser.close()
  return context
}
