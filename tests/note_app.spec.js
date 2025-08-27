const { test, expect, beforeEach, describe } = require("@playwright/test")

const user = {
    username: "PPaco",
    name: "Pacp Paquez",
    password: "paquitronez"
}

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173")
  })

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("button", { name: "log in" }).click()
    await expect(page.getByText("Username")).toBeVisible()
    await expect(page.getByText("Password")).toBeVisible()
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible()
  })
})