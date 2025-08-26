<?php

namespace App\Service;

use App\Entity\Product;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\SessionInterface;

class CartService
{
    private const CART_SESSION_KEY = 'shopping_cart';

    public function __construct(
        private RequestStack $requestStack
    ) {}

    private function getSession(): SessionInterface
    {
        return $this->requestStack->getSession();
    }

    public function getCart(): array
    {
        return $this->getSession()->get(self::CART_SESSION_KEY, []);
    }

    public function addProduct(Product $product, int $quantity = 1): void
    {
        $cart = $this->getCart();
        $productId = $product->getId();

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'product' => $product,
                'quantity' => $quantity,
                'unit_price' => (float) $product->getPrice(),
                'total_price' => (float) $product->getPrice() * $quantity,
            ];
        }

        // Update total price
        $cart[$productId]['total_price'] = $cart[$productId]['unit_price'] * $cart[$productId]['quantity'];

        // Ensure we don't exceed stock
        if ($cart[$productId]['quantity'] > $product->getStock()) {
            $cart[$productId]['quantity'] = $product->getStock();
            $cart[$productId]['total_price'] = $cart[$productId]['unit_price'] * $cart[$productId]['quantity'];
        }

        $this->getSession()->set(self::CART_SESSION_KEY, $cart);
    }

    public function removeProduct(Product $product): void
    {
        $cart = $this->getCart();
        $productId = $product->getId();

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            $this->getSession()->set(self::CART_SESSION_KEY, $cart);
        }
    }

    public function updateProductQuantity(Product $product, int $quantity): void
    {
        if ($quantity <= 0) {
            $this->removeProduct($product);
            return;
        }

        $cart = $this->getCart();
        $productId = $product->getId();

        if (isset($cart[$productId])) {
            // Ensure we don't exceed stock
            $actualQuantity = min($quantity, $product->getStock());
            
            $cart[$productId]['quantity'] = $actualQuantity;
            $cart[$productId]['total_price'] = $cart[$productId]['unit_price'] * $actualQuantity;
            
            $this->getSession()->set(self::CART_SESSION_KEY, $cart);
        }
    }

    public function getCartItemCount(): int
    {
        $cart = $this->getCart();
        $count = 0;

        foreach ($cart as $item) {
            $count += $item['quantity'];
        }

        return $count;
    }

    public function getCartTotal(): float
    {
        $cart = $this->getCart();
        $total = 0;

        foreach ($cart as $item) {
            $total += $item['total_price'];
        }

        return $total;
    }

    public function getFormattedCartTotal(): string
    {
        return '$' . number_format($this->getCartTotal(), 2);
    }

    public function clearCart(): void
    {
        $this->getSession()->remove(self::CART_SESSION_KEY);
    }

    public function isEmpty(): bool
    {
        $cart = $this->getCart();
        return empty($cart);
    }

    public function hasProduct(Product $product): bool
    {
        $cart = $this->getCart();
        return isset($cart[$product->getId()]);
    }

    public function getProductQuantity(Product $product): int
    {
        $cart = $this->getCart();
        return $cart[$product->getId()]['quantity'] ?? 0;
    }

    public function getCartItems(): array
    {
        $cart = $this->getCart();
        return array_values($cart);
    }

    public function calculateTax(float $taxRate = 0.08): float
    {
        return $this->getCartTotal() * $taxRate;
    }

    public function calculateShipping(): float
    {
        $total = $this->getCartTotal();
        
        // Free shipping over $100
        if ($total >= 100) {
            return 0;
        }
        
        // Standard shipping
        return 9.99;
    }

    public function getOrderTotal(): float
    {
        return $this->getCartTotal() + $this->calculateTax() + $this->calculateShipping();
    }

    public function getFormattedOrderTotal(): string
    {
        return '$' . number_format($this->getOrderTotal(), 2);
    }
}