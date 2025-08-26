<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Service\CartService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/cart')]
class CartController extends AbstractController
{
    public function __construct(
        private CartService $cartService
    ) {}

    #[Route('/', name: 'app_cart')]
    public function index(): Response
    {
        $cart = $this->cartService->getCart();

        return $this->render('cart/index.html.twig', [
            'cart' => $cart,
        ]);
    }

    #[Route('/add/{id}', name: 'app_cart_add', methods: ['POST'])]
    public function add(
        Product $product,
        Request $request
    ): JsonResponse {
        $quantity = $request->request->getInt('quantity', 1);
        
        if ($quantity <= 0) {
            return new JsonResponse(['error' => 'Invalid quantity'], 400);
        }

        if (!$product->isActive() || !$product->isInStock()) {
            return new JsonResponse(['error' => 'Product not available'], 400);
        }

        if ($quantity > $product->getStock()) {
            return new JsonResponse(['error' => 'Not enough stock available'], 400);
        }

        $this->cartService->addProduct($product, $quantity);

        return new JsonResponse([
            'success' => true,
            'message' => 'Product added to cart',
            'cart_count' => $this->cartService->getCartItemCount(),
            'cart_total' => $this->cartService->getCartTotal(),
        ]);
    }

    #[Route('/update/{id}', name: 'app_cart_update', methods: ['POST'])]
    public function update(
        Product $product,
        Request $request
    ): JsonResponse {
        $quantity = $request->request->getInt('quantity', 1);
        
        if ($quantity <= 0) {
            $this->cartService->removeProduct($product);
            return new JsonResponse([
                'success' => true,
                'message' => 'Product removed from cart',
                'cart_count' => $this->cartService->getCartItemCount(),
                'cart_total' => $this->cartService->getCartTotal(),
            ]);
        }

        if ($quantity > $product->getStock()) {
            return new JsonResponse(['error' => 'Not enough stock available'], 400);
        }

        $this->cartService->updateProductQuantity($product, $quantity);

        return new JsonResponse([
            'success' => true,
            'message' => 'Cart updated',
            'cart_count' => $this->cartService->getCartItemCount(),
            'cart_total' => $this->cartService->getCartTotal(),
        ]);
    }

    #[Route('/remove/{id}', name: 'app_cart_remove', methods: ['POST'])]
    public function remove(Product $product): JsonResponse
    {
        $this->cartService->removeProduct($product);

        return new JsonResponse([
            'success' => true,
            'message' => 'Product removed from cart',
            'cart_count' => $this->cartService->getCartItemCount(),
            'cart_total' => $this->cartService->getCartTotal(),
        ]);
    }

    #[Route('/clear', name: 'app_cart_clear', methods: ['POST'])]
    public function clear(): JsonResponse
    {
        $this->cartService->clearCart();

        return new JsonResponse([
            'success' => true,
            'message' => 'Cart cleared',
            'cart_count' => 0,
            'cart_total' => 0,
        ]);
    }

    #[Route('/count', name: 'app_cart_count', methods: ['GET'])]
    public function count(): JsonResponse
    {
        return new JsonResponse([
            'count' => $this->cartService->getCartItemCount(),
            'total' => $this->cartService->getCartTotal(),
        ]);
    }
}