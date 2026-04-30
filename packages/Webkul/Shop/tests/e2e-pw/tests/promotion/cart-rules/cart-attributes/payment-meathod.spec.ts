import { test } from "../../../../setup";
import { expect } from "@playwright/test";
import { ProductCreation } from "../../../../pages/admin/catalog/products/ProductCreatePage";
import { RuleDeletePage } from "../../../../pages/admin/marketing/promotion/RuleDeletePage";
import { RuleCreatePage } from "../../../../pages/admin/marketing/promotion/RuleCreatePage";
import { RuleApplyPage } from "../../../../pages/shop/rules/RuleApplyPage";
import { loginAsAdmin } from "../../../../utils/admin";

test.beforeEach("should create simple product", async ({ adminPage }) => {
    const productCreation = new ProductCreation(adminPage);

    await productCreation.createProduct({
        type: "simple",
        sku: `SKU-${Date.now()}`,
        name: `Simple-${Date.now()}`,
        shortDescription: "Short desc",
        description: "Full desc",
        price: Math.floor(Math.random() * 1000),
        weight: 1,
        inventory: 100,
    });
});

test.afterEach(
    "should delete the created product and rule",
    async ({ adminPage }) => {
        const ruleDeletePage = new RuleDeletePage(adminPage);
        await ruleDeletePage.deleteRuleAndProduct();
    },
);

test.describe("cart rules", () => {
    test.describe("cart attribute conditions", () => {
        test("should apply coupon when payment meathod condition is -> is equal to (fixed)", async ({
            page,
        }) => {
            const ruleCreatePage = new RuleCreatePage(page);
            const ruleApplyPage = new RuleApplyPage(page);
            await loginAsAdmin(page);
            await ruleCreatePage.cartRuleCreationFlow();
            const discountValue = await ruleCreatePage.addCondition({
                attribute: "cart|payment_method",
                operator: "==",
                optionSelect: "moneytransfer",
                couponType: "fixed",
            });

            if (discountValue === undefined) {
                throw new Error("Discount value was not created.");
            }

            await ruleCreatePage.saveCartRule();
            const discountedAmount =
                await ruleApplyPage.calculateDiscountedAmmount(
                    discountValue,
                    "fixed",
                );
            await ruleApplyPage.applyCouponAtCheckout();

            await expect(
                page.getByText("Coupon code applied successfully.").first(),
            ).toBeVisible();

            if (discountedAmount == 0) {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText("$0.00");
            } else {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText(discountedAmount.toString());
            }
        });

        test("should apply coupon when payment meathod condition is -> is equal to (percentage)", async ({
            page,
        }) => {
            const ruleCreatePage = new RuleCreatePage(page);
            const ruleApplyPage = new RuleApplyPage(page);
            await loginAsAdmin(page);
            await ruleCreatePage.cartRuleCreationFlow();
            const discountValue = await ruleCreatePage.addCondition({
                attribute: "cart|payment_method",
                operator: "==",
                optionSelect: "moneytransfer",
                couponType: "percentage",
            });

            if (discountValue === undefined) {
                throw new Error("Discount value was not created.");
            }

            await ruleCreatePage.saveCartRule();
            const discountedAmount =
                await ruleApplyPage.calculateDiscountedAmmount(
                    discountValue,
                    "percentage",
                );
            await ruleApplyPage.applyCouponAtCheckout();

            await expect(
                page.getByText("Coupon code applied successfully.").first(),
            ).toBeVisible();

            if (discountedAmount == 0) {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText("$0.00");
            } else {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText(discountedAmount.toString());
            }
        });

        test("should apply coupon when payment meathod condition is -> is not equal to (fixed)", async ({
            page,
        }) => {
            const ruleCreatePage = new RuleCreatePage(page);
            const ruleApplyPage = new RuleApplyPage(page);
            await loginAsAdmin(page);
            await ruleCreatePage.cartRuleCreationFlow();
            const discountValue = await ruleCreatePage.addCondition({
                attribute: "cart|payment_method",
                operator: "!=",
                optionSelect: "cashondelivery",
                couponType: "fixed",
            });

            if (discountValue === undefined) {
                throw new Error("Discount value was not created.");
            }

            await ruleCreatePage.saveCartRule();
            const discountedAmount =
                await ruleApplyPage.calculateDiscountedAmmount(
                    discountValue,
                    "fixed",
                );
            await ruleApplyPage.applyCouponAtCheckout();

            await expect(
                page.getByText("Coupon code applied successfully.").first(),
            ).toBeVisible();

            if (discountedAmount == 0) {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText("$0.00");
            } else {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText(discountedAmount.toString());
            }
        });

        test("should apply coupon when payment meathod condition is -> is not equal to (percentage)", async ({
            page,
        }) => {
            const ruleCreatePage = new RuleCreatePage(page);
            const ruleApplyPage = new RuleApplyPage(page);
            await loginAsAdmin(page);
            await ruleCreatePage.cartRuleCreationFlow();
            const discountValue = await ruleCreatePage.addCondition({
                attribute: "cart|payment_method",
                operator: "!=",
                optionSelect: "cashondelivery",
                couponType: "percentage",
            });

            if (discountValue === undefined) {
                throw new Error("Discount value was not created.");
            }

            await ruleCreatePage.saveCartRule();
            const discountedAmount =
                await ruleApplyPage.calculateDiscountedAmmount(
                    discountValue,
                    "percentage",
                );
            await ruleApplyPage.applyCouponAtCheckout();

            await expect(
                page.getByText("Coupon code applied successfully.").first(),
            ).toBeVisible();

            if (discountedAmount == 0) {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText("$0.00");
            } else {
                await expect(
                    page.getByText("Grand Total").locator(".."),
                ).toContainText(discountedAmount.toString());
            }
        });
    });
});
