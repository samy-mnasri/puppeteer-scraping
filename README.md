# puppeteer-scraping

Scrape anything with very few lines of code.

`puppeteer-scraping` is a framework to help you save time scraping any website with Puppeteer.

It uses `puppeteer-extra-plugin-stealth` under the hood.

## Motivation

- Scraping websites is often about following the same steps
- We should code only what's unique to the scraped website: the scraping logic, the paths taken and the data extracted
- Puppeteer is the way to go for JavaScript rendered websites but it could be easier to use

## Installation

Using npm:

```bash
npm install puppeteer-scraping
```

Using yarn:

```bash
yarn add puppeteer-scraping
```

## Usage

```javascript
const scraping = require('puppeteer-scraping')
const puppeteer = require('puppeteer')

module.exports = async (req, res) => {  
  const { items } = await scraping({
    puppeteer,
    options: { headless: true },
    method: {
      startPage: 'https://example.com',
      goToPages: {
        '//a[@class="item"]/@href': {
          items: {
            products: {
              productTitle: { path: '//h1' }
            },
          }
        }
      }
    }
  })
  
  res.json(items.products)
}
```