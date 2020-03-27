module.exports = async ({ options, puppeteer, method }) => {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.goto(method.firstPage)
  const data = await page.title()
  await browser.close()
  return data
}