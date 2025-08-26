<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/order')]
class OrderController extends AbstractController
{
    #[Route('/checkout', name: 'app_order_checkout')]
    public function checkout(SessionInterface $session, ProductRepository $productRepository): Response
    {
        $cart = $session->get('cart', []);
        
        if (empty($cart)) {
            $this->addFlash('error', 'Your cart is empty!');
            return $this->redirectToRoute('app_cart');
        }

        $cartItems = [];
        $total = 0;

        foreach ($cart as $productId => $quantity) {
            $product = $productRepository->find($productId);
            if ($product) {
                $cartItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'subtotal' => $product->getPrice() * $quantity
                ];
                $total += $product->getPrice() * $quantity;
            }
        }

        return $this->render('order/checkout.html.twig', [
            'cart_items' => $cartItems,
            'total' => $total,
        ]);
    }

    #[Route('/create', name: 'app_order_create', methods: ['POST'])]
    public function create(Request $request, SessionInterface $session, EntityManagerInterface $entityManager, ProductRepository $productRepository): Response
    {
        $cart = $session->get('cart', []);
        
        if (empty($cart)) {
            $this->addFlash('error', 'Your cart is empty!');
            return $this->redirectToRoute('app_cart');
        }

        $order = new Order();
        $order->setUser($this->getUser());
        $order->setShippingAddress($request->request->get('shipping_address'));
        $order->setPhone($request->request->get('phone'));
        $order->setNotes($request->request->get('notes'));
        $order->setPaymentMethod('cash_on_delivery');

        $total = 0;

        foreach ($cart as $productId => $quantity) {
            $product = $productRepository->find($productId);
            if ($product && $product->getStock() >= $quantity) {
                $orderItem = new OrderItem();
                $orderItem->setProduct($product);
                $orderItem->setQuantity($quantity);
                $orderItem->setPrice($product->getPrice());
                $orderItem->setOrderRef($order);
                
                $entityManager->persist($orderItem);
                $total += $product->getPrice() * $quantity;

                // Update stock
                $product->setStock($product->getStock() - $quantity);
                $entityManager->persist($product);
            }
        }

        $order->setTotalAmount($total);
        $entityManager->persist($order);
        $entityManager->flush();

        // Clear cart
        $session->remove('cart');

        $this->addFlash('success', 'Order placed successfully! You will pay when you receive your products.');

        return $this->redirectToRoute('app_order_success', ['id' => $order->getId()]);
    }

    #[Route('/success/{id}', name: 'app_order_success')]
    public function success(Order $order): Response
    {
        return $this->render('order/success.html.twig', [
            'order' => $order,
        ]);
    }

    #[Route('/my-orders', name: 'app_my_orders')]
    public function myOrders(OrderRepository $orderRepository): Response
    {
        $orders = $orderRepository->findByUser($this->getUser()->getId());

        return $this->render('order/my_orders.html.twig', [
            'orders' => $orders,
        ]);
    }

    #[Route('/{id}', name: 'app_order_show')]
    public function show(Order $order): Response
    {
        if ($order->getUser() !== $this->getUser()) {
            throw $this->createAccessDeniedException('You can only view your own orders.');
        }

        return $this->render('order/show.html.twig', [
            'order' => $order,
        ]);
    }
}