/* eslint-disable import/no-extraneous-dependencies */
import { Builder } from 'selenium-webdriver';
// eslint-disable-next-line import/extensions
import chrome from 'selenium-webdriver/chrome.js';

// Base URL for the application
const BASE_URL = 'http://localhost:3031';

// Setup function to create a new WebDriver instance
async function setupDriver() {
  const options = new chrome.Options();
  // Uncomment the line below if you want to run tests in headless mode
  // options.addArguments('--headless');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  // Set implicit wait time
  await driver.manage().setTimeouts({ implicit: 10000 });
  
  // Maximize window
  await driver.manage().window().maximize();

  return driver;
}

export {
  BASE_URL,
  setupDriver
}; 