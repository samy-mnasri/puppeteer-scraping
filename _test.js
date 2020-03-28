const puppeteer = require('puppeteer')

const scraping = require('./index')

const main = async () => {
  const { items } = await scraping({
    puppeteer,
    options: { headless: true },
    method: { startPage: 'https://example.com' }
  })

  console.log(items)
}

main()
