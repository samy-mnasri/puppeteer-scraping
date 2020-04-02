const { addExtra } = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

module.exports = async ({ options, puppeteer, method, onError }) => {
  const context = { items: [] }

  const puppeteerExtra = addExtra(puppeteer)
  const browser = await puppeteerExtra.launch(options)
  StealthPlugin().onBrowser(browser)
  context.page = await browser.newPage()
  StealthPlugin().onPageCreated(context.page)
  let nextPage

  try {
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
        if (!method.goToPages.pageAlreadyScraped || !await method.goToPages.pageAlreadyScraped(url, context)) {
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
      }

      nextPage = await method.nextPage(context)
    } while (nextPage)

    await browser.close()
    return context
  } catch (error) {
    onError(error, context)
  }
}
