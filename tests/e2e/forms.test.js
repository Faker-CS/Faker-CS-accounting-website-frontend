/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import { By, until } from 'selenium-webdriver';
import { test, expect, describe, afterAll, beforeAll, beforeEach } from '@jest/globals';

// eslint-disable-next-line import/extensions
import { BASE_URL, setupDriver } from './setup.js';

describe('Forms Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await setupDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    // Login before each test
    await driver.get(`${BASE_URL}/auth/jwt/sign-in`);
    await driver.findElement(By.name('email')).sendKeys('chifaker@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('faker123');
    await driver.findElement(By.xpath("//button[contains(text(), 'Sign in')]")).click();
    
    // Wait for dashboard to load
    await driver.wait(
      until.urlContains('/dashboard'),
      10000
    );
  });

  describe('Company Registration Forms', () => {
    test('should fill and submit SARL form', async () => {
      // Navigate to SARL form
      await driver.get(`${BASE_URL}/dashboard/document demands/sarl`);
      
      // Fill company name
      await driver.findElement(By.name('companyName')).sendKeys('Test SARL Company');
      
      // Fill company address
      await driver.findElement(By.name('address')).sendKeys('123 Test Street');
      
      // Fill company city
      await driver.findElement(By.name('city')).sendKeys('Test City');
      
      // Fill company state
      await driver.findElement(By.name('state')).sendKeys('Test State');
      
      // Fill company zip code
      await driver.findElement(By.name('zipCode')).sendKeys('12345');
      
      // Fill company phone
      await driver.findElement(By.name('phoneNumber')).sendKeys('1234567890');
      
      // Submit form
      const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]"));
      await submitButton.click();
      
      // Wait for success message or redirect
      await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'MuiAlert-message')]")),
        5000
      );
      
      // Verify success message
      const successMessage = await driver.findElement(By.xpath("//div[contains(@class, 'MuiAlert-message')]"));
      expect(await successMessage.isDisplayed()).toBeTruthy();
    });

    test('should validate required fields in SARL form', async () => {
      // Navigate to SARL form
      await driver.get(`${BASE_URL}/dashboard/document demands/sarl`);
      
      // Try to submit without filling required fields
      const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Submit')]"));
      await submitButton.click();
      
      // Wait for validation messages
      const errorMessages = await driver.wait(
        until.elementsLocated(By.xpath("//p[contains(@class, 'MuiFormHelperText-root')]")),
        5000
      );
      
      // Verify error messages are displayed
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Document Upload Forms', () => {
    test('should upload document', async () => {
      // Navigate to document upload page
      await driver.get(`${BASE_URL}/dashboard/document demands/deposit`);
      
      // Find file input
      const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
      
      // Upload file (you'll need to provide a valid file path)
      await fileInput.sendKeys('/path/to/your/test/file.pdf');
      
      // Submit form
      const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Upload')]"));
      await submitButton.click();
      
      // Wait for success message
      await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'MuiAlert-message')]")),
        5000
      );
      
      // Verify success message
      const successMessage = await driver.findElement(By.xpath("//div[contains(@class, 'MuiAlert-message')]"));
      expect(await successMessage.isDisplayed()).toBeTruthy();
    });

    test('should validate file type', async () => {
      // Navigate to document upload page
      await driver.get(`${BASE_URL}/dashboard/document demands/deposit`);
      
      // Find file input
      const fileInput = await driver.findElement(By.xpath("//input[@type='file']"));
      
      // Upload invalid file type
      await fileInput.sendKeys('/path/to/invalid/file.txt');
      
      // Submit form
      const submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Upload')]"));
      await submitButton.click();
      
      // Wait for error message
      const errorMessage = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'MuiAlert-message')]")),
        5000
      );
      
      // Verify error message
      expect(await errorMessage.isDisplayed()).toBeTruthy();
    });
  });

  describe('Profile Update Form', () => {
    test('should update user profile', async () => {
      // Navigate to profile page
      await driver.get(`${BASE_URL}/dashboard/profile`);
      
      // Update name
      const nameInput = await driver.findElement(By.name('name'));
      await nameInput.clear();
      await nameInput.sendKeys('Updated Name');
      
      // Update phone
      const phoneInput = await driver.findElement(By.name('phoneNumber'));
      await phoneInput.clear();
      await phoneInput.sendKeys('9876543210');
      
      // Save changes
      const saveButton = await driver.findElement(By.xpath("//button[contains(text(), 'Save')]"));
      await saveButton.click();
      
      // Wait for success message
      await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'MuiAlert-message')]")),
        5000
      );
      
      // Verify success message
      const successMessage = await driver.findElement(By.xpath("//div[contains(@class, 'MuiAlert-message')]"));
      expect(await successMessage.isDisplayed()).toBeTruthy();
    });
  });
}); 