const { test, expect, beforeEach, describe } = require("@playwright/test")

const user = {
    username: "PPaco",
    name: "Paco Paquez",
    password: "paquitronez"
}

describe("Blog app", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3003/api/testing/reset")
        await request.post("http://localhost:3003/api/users", {
            data: {
                name: "Matti Luukkainen",
                username: "mluukkai",
                password: "salainen"
            }
        })

        await page.goto("http://localhost:5173")
    })

    test("Login form is shown", async ({ page }) => {
        await page.getByRole("button", { name: "log in" }).click()
        await expect(page.getByText("Username")).toBeVisible()
        await expect(page.getByText("Password")).toBeVisible()
        await expect(page.getByRole("button", { name: "Log in" })).toBeVisible()
    })

    describe("Login", () => {
        beforeEach(async ({ page, request }) => {
            await page.getByRole("button", { name: "log in" }).click()
        })
        test("succeeds with correct credentials", async ({ page }) => {
            await page.locator("#username").fill("mluukkai")
            await page.locator("#password").fill("salainen")
            await page.getByRole("button", { name: "Log in" }).click()

            await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible()
        })

        test("fails with wrong credentials", async ({ page }) => {
            await page.locator("#username").fill("mluukkai")
            await page.locator("#password").fill("wrong")
            await page.getByRole("button", { name: "Log in" }).click()

            await expect(page.getByText("Wrong credentials")).toBeVisible()
        })

        describe("When logged in", () => {
            beforeEach(async ({ page }) => {
                await page.locator("#username").fill("mluukkai")
                await page.locator("#password").fill("salainen")
                await page.getByRole("button", { name: "Log in" }).click()
                await page.getByRole("button", { name: "New Note" }).click()

                await page.locator("#blogTitle").fill("Prueba 1")
                await page.locator("#blogAuthor").fill("Yo mismo")
                await page.locator("#blogUrl").fill("www.pruebaTest.com")

                await page.getByRole("button", { name: "Create" }).click()
            })

            test("a new blog can be created", async ({ page }) => {
                await expect(page.getByText("Prueba 1 Yo mismo")).toBeVisible()
            })

            test("the new blog can be liked", async ({ page }) => {
                await page.getByRole("button", { name: "View" }).click()
                await page.getByRole("button", { name: "Like" }).click()

                await expect(page.getByText("Likes: 1")).toBeVisible()
            })

            test("the new blog can be deleted", async ({ page }) => {
                await page.getByRole("button", { name: "View" }).click()
                await page.getByRole("button", { name: "Remove" }).click()

                await expect(page.getByText("Prueba 1 Yo mismo")).not.toBeVisible()
            })
        })
    })


})