/* eslint-disable import/no-extraneous-dependencies */
import { By, until } from 'selenium-webdriver';
import { test, expect, describe, afterAll, beforeAll, beforeEach } from '@jest/globals';

// eslint-disable-next-line import/extensions
import { BASE_URL, setupDriver } from './setup.js';


describe('Navigation Tests', () => {
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

  describe('Dashboard Navigation', () => {
    test('should navigate to home page', async () => {
      // Click on home menu item
      const homeLink = await driver.findElement(By.xpath("//a[contains(@href, '/dashboard/home')]"));
      await homeLink.click();

      // Wait for page load
      await driver.wait(
        until.urlContains('/dashboard/home'),
        5000
      );

      // Verify we're on the home page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard/home');
    });

    test('should navigate to calendar page', async () => {
      // Click on calendar menu item
      const calendarLink = await driver.findElement(By.xpath("//a[contains(@href, '/dashboard/calendar')]"));
      await calendarLink.click();

      // Wait for page load
      await driver.wait(
        until.urlContains('/dashboard/calendar'),
        5000
      );

      // Verify we're on the calendar page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard/calendar');
    });

    test('should navigate to file manager', async () => {
      // Click on file manager menu item
      const fileManagerLink = await driver.findElement(By.xpath("//a[contains(@href, '/dashboard/file-manager')]"));
      await fileManagerLink.click();

      // Wait for page load
      await driver.wait(
        until.urlContains('/dashboard/file-manager'),
        5000
      );

      // Verify we're on the file manager page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard/file-manager');
    });

    test('should navigate to chat page', async () => {
      // Click on chat menu item
      const chatLink = await driver.findElement(By.xpath("//a[contains(@href, '/dashboard/chat')]"));
      await chatLink.click();

      // Wait for page load
      await driver.wait(
        until.urlContains('/dashboard/chat'),
        5000
      );

      // Verify we're on the chat page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard/chat');
    });
  });

  describe('User Menu Navigation', () => {
    test('should open user menu', async () => {
      // Click on user menu button
      const userMenuButton = await driver.findElement(By.xpath("//button[contains(@aria-label, 'account')]"));
      await userMenuButton.click();

      // Wait for menu to appear
      const menuItems = await driver.wait(
        until.elementsLocated(By.xpath("//div[contains(@role, 'menu')]//a")),
        5000
      );

      // Verify menu items are present
      expect(menuItems.length).toBeGreaterThan(0);
    });

    test('should navigate to profile page', async () => {
      // Open user menu
      const userMenuButton = await driver.findElement(By.xpath("//button[contains(@aria-label, 'account')]"));
      await userMenuButton.click();

      // Click on profile link
      const profileLink = await driver.findElement(By.xpath("//a[contains(@href, '/dashboard/profile')]"));
      await profileLink.click();

      // Wait for page load
      await driver.wait(
        until.urlContains('/dashboard/profile'),
        5000
      );

      // Verify we're on the profile page
      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard/profile');
    });
  });

  describe('Mobile Navigation', () => {
    test('should open mobile menu', async () => {
      // Set window size to mobile dimensions
      await driver.manage().window().setRect({ width: 375, height: 812 });

      // Click on mobile menu button
      const mobileMenuButton = await driver.findElement(By.xpath("//button[contains(@aria-label, 'menu')]"));
      await mobileMenuButton.click();

      // Wait for mobile menu to appear
      const mobileMenu = await driver.wait(
        until.elementLocated(By.xpath("//div[contains(@role, 'presentation')]")),
        5000
      );

      // Verify mobile menu is displayed
      expect(await mobileMenu.isDisplayed()).toBeTruthy();
    });
  });
}); 