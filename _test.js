const puppeteer = require('puppeteer')

const scraping = require('./index')

const main = async () => {
  const data = await scraping({
    puppeteer,
    options: { headless: true },
    method: {
      firstPage: 'https://example.com'
    }
  })

  console.log(data)
}

main()
