// eslint-disable-next-line import/no-extraneous-dependencies
import { By, until } from 'selenium-webdriver';
// eslint-disable-next-line import/no-extraneous-dependencies
import { test, expect, describe, afterAll, beforeAll, beforeEach } from '@jest/globals';

// eslint-disable-next-line import/extensions
import { BASE_URL, setupDriver } from './setup.js';

describe('Authentication Flow Tests', () => {
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
    await driver.get(BASE_URL);
  });

  describe('Sign In Flow', () => {
    test('should display sign in form', async () => {
      // Navigate to sign in page
      await driver.get(`${BASE_URL}/auth/jwt/sign-in`);
      
      // Check if email input is present
      const emailInput = await driver.findElement(By.name('email'));
      expect(await emailInput.isDisplayed()).toBeTruthy();
      
      // Check if password input is present
      const passwordInput = await driver.findElement(By.name('password'));
      expect(await passwordInput.isDisplayed()).toBeTruthy();
      
      // Check if sign in button is present
      const signInButton = await driver.findElement(By.xpath("//button[contains(text(), 'Sign in')]"));
      expect(await signInButton.isDisplayed()).toBeTruthy();
    });

    test('should show error with invalid credentials', async () => {
      await driver.get(`${BASE_URL}/auth/jwt/sign-in`);
      
      // Enter invalid credentials
      await driver.findElement(By.name('email')).sendKeys('invalid@example.com');
      await driver.findElement(By.name('password')).sendKeys('wrongpassword');
      
      // Click sign in button
      await driver.findElement(By.xpath("//button[contains(text(), 'Sign in')]")).click();
      
      // Wait for error message
      const errorMessage = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@class, 'MuiAlert-message')]")),
        5000
      );
      
      expect(await errorMessage.isDisplayed()).toBeTruthy();
    });

    test('should successfully sign in with valid credentials', async () => {
      await driver.get(`${BASE_URL}/auth/jwt/sign-in`);
      
      // Enter valid credentials
      await driver.findElement(By.name('email')).sendKeys('chifaker@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('faker123');
      
      // Click sign in button
      await driver.findElement(By.xpath("//button[contains(text(), 'Sign in')]")).click();
      
      // Wait for redirect to dashboard
      await driver.wait(
        until.urlContains('/dashboard'),
        10000
      );
      
      // Verify we're on the dashboard
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard');
    });
  });

  describe('Sign Up Flow', () => {
    test('should display sign up form', async () => {
      await driver.get(`${BASE_URL}/auth/jwt/sign-up`);
      
      // Check if name input is present
      const nameInput = await driver.findElement(By.name('name'));
      expect(await nameInput.isDisplayed()).toBeTruthy();
      
      // Check if email input is present
      const emailInput = await driver.findElement(By.name('email'));
      expect(await emailInput.isDisplayed()).toBeTruthy();
      
      // Check if password input is present
      const passwordInput = await driver.findElement(By.name('password'));
      expect(await passwordInput.isDisplayed()).toBeTruthy();
    });

    test('should successfully register new user', async () => {
      await driver.get(`${BASE_URL}/auth/jwt/sign-up`);
      
      // Generate unique email
      const uniqueEmail = `test${Date.now()}@example.com`;
      
      // Fill registration form
      await driver.findElement(By.name('name')).sendKeys('Test User');
      await driver.findElement(By.name('email')).sendKeys(uniqueEmail);
      await driver.findElement(By.name('password')).sendKeys('password123');
      
      // Click sign up button
      await driver.findElement(By.xpath("//button[contains(text(), 'Sign up')]")).click();
      
      // Wait for redirect to dashboard
      await driver.wait(
        until.urlContains('/dashboard'),
        10000
      );
      
      // Verify we're on the dashboard
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard');
    });
  });

  describe('Logout Flow', () => {
    test('should successfully logout user', async () => {
      // First sign in
      await driver.get(`${BASE_URL}/auth/jwt/sign-in`);
      await driver.findElement(By.name('email')).sendKeys('chifaker@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('faker123');
      await driver.findElement(By.xpath("//button[contains(text(), 'Sign in')]")).click();
      
      // Wait for dashboard
      await driver.wait(
        until.urlContains('/dashboard'),
        10000
      );
      
      // Find and click logout button (adjust selector based on your UI)
      const logoutButton = await driver.findElement(By.xpath("//button[contains(text(), 'Logout')]"));
      await logoutButton.click();
      
      // Wait for redirect to sign in page
      await driver.wait(
        until.urlContains('/auth/jwt/sign-in'),
        10000
      );
      
      // Verify we're back on the sign in page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/auth/jwt/sign-in');
    });
  });
}); 