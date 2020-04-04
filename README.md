# puppeteer-scraping

Scrape anything with very few lines of code.

`puppeteer-scraping` is a light framework to help you save time scraping any website with Puppeteer.

## Motivation

- Scraping websites is often about following the same steps
- We should code only what's unique to the scraped website: the paths taken and the data to extract
- Puppeteer could be a easier/quicker to code with

## Installation

Using npm:

```bash
npm install puppeteer-scraping
```

Using yarn:

```bash
yarn add puppeteer-scraping
```

## Example

```javascript
const puppeteer = require('puppeteer')
const scraping = require('puppeteer-scraping')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

module.exports = async (req, res) => {  
  const method = {
    startPage: 'https://example.com',
    goToPages: {
      '//a[@class="example"]': {
        extractItems: {
          'products': {
            'productTitle': { path: '//h1', getFirst: true },
            'productUrl': { value: context => context.page.url() }
          },
        }
      }
    }
  }

  const { items } = await scraping({
    puppeteer,
    options: { headless: true },
    plugins: [StealthPlugin],
    proxies: ['1.2.3.4', '5.6.7.8']
    method
  })
  
  res.json(items.products)
}
```

## Documentation

(Coming soon)

## Contributing

Any contribution is welcome! If you think an important feature is missing, please send a message to `puppeteer-scraping@samy.mn`.

## License

MIT