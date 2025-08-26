<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/admin')]
class AdminController extends AbstractController
{
    #[Route('/', name: 'app_admin_dashboard')]
    public function dashboard(OrderRepository $orderRepository, ProductRepository $productRepository, UserRepository $userRepository): Response
    {
        $totalOrders = count($orderRepository->findAll());
        $pendingOrders = count($orderRepository->findByStatus('pending'));
        $totalProducts = count($productRepository->findAll());
        $totalUsers = count($userRepository->findAll());
        $recentOrders = $orderRepository->findBy([], ['createdAt' => 'DESC'], 5);

        return $this->render('admin/dashboard.html.twig', [
            'total_orders' => $totalOrders,
            'pending_orders' => $pendingOrders,
            'total_products' => $totalProducts,
            'total_users' => $totalUsers,
            'recent_orders' => $recentOrders,
        ]);
    }

    #[Route('/orders', name: 'app_admin_orders')]
    public function orders(OrderRepository $orderRepository, Request $request): Response
    {
        $status = $request->query->get('status');
        
        if ($status) {
            $orders = $orderRepository->findByStatus($status);
        } else {
            $orders = $orderRepository->findBy([], ['createdAt' => 'DESC']);
        }

        return $this->render('admin/orders.html.twig', [
            'orders' => $orders,
            'selected_status' => $status,
        ]);
    }

    #[Route('/orders/{id}/update-status', name: 'app_admin_order_update_status', methods: ['POST'])]
    public function updateOrderStatus(Order $order, Request $request, EntityManagerInterface $entityManager): Response
    {
        $status = $request->request->get('status');
        $order->setStatus($status);
        $order->setUpdatedAt(new \DateTimeImmutable());
        
        $entityManager->persist($order);
        $entityManager->flush();

        $this->addFlash('success', 'Order status updated successfully!');

        return $this->redirectToRoute('app_admin_orders');
    }

    #[Route('/products', name: 'app_admin_products')]
    public function products(ProductRepository $productRepository): Response
    {
        $products = $productRepository->findAll();

        return $this->render('admin/products.html.twig', [
            'products' => $products,
        ]);
    }

    #[Route('/products/new', name: 'app_admin_product_new')]
    public function newProduct(Request $request, EntityManagerInterface $entityManager, CategoryRepository $categoryRepository): Response
    {
        if ($request->isMethod('POST')) {
            $product = new Product();
            $product->setName($request->request->get('name'));
            $product->setDescription($request->request->get('description'));
            $product->setPrice($request->request->get('price'));
            $product->setStock($request->request->get('stock'));
            $product->setImage($request->request->get('image'));
            
            $category = $categoryRepository->find($request->request->get('category'));
            $product->setCategory($category);

            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash('success', 'Product created successfully!');
            return $this->redirectToRoute('app_admin_products');
        }

        $categories = $categoryRepository->findAll();

        return $this->render('admin/product_form.html.twig', [
            'categories' => $categories,
        ]);
    }

    #[Route('/products/{id}/edit', name: 'app_admin_product_edit')]
    public function editProduct(Product $product, Request $request, EntityManagerInterface $entityManager, CategoryRepository $categoryRepository): Response
    {
        if ($request->isMethod('POST')) {
            $product->setName($request->request->get('name'));
            $product->setDescription($request->request->get('description'));
            $product->setPrice($request->request->get('price'));
            $product->setStock($request->request->get('stock'));
            $product->setImage($request->request->get('image'));
            
            $category = $categoryRepository->find($request->request->get('category'));
            $product->setCategory($category);

            $entityManager->persist($product);
            $entityManager->flush();

            $this->addFlash('success', 'Product updated successfully!');
            return $this->redirectToRoute('app_admin_products');
        }

        $categories = $categoryRepository->findAll();

        return $this->render('admin/product_form.html.twig', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    #[Route('/categories', name: 'app_admin_categories')]
    public function categories(CategoryRepository $categoryRepository): Response
    {
        $categories = $categoryRepository->findAll();

        return $this->render('admin/categories.html.twig', [
            'categories' => $categories,
        ]);
    }

    #[Route('/categories/new', name: 'app_admin_category_new')]
    public function newCategory(Request $request, EntityManagerInterface $entityManager): Response
    {
        if ($request->isMethod('POST')) {
            $category = new Category();
            $category->setName($request->request->get('name'));
            $category->setDescription($request->request->get('description'));
            $category->setImage($request->request->get('image'));

            $entityManager->persist($category);
            $entityManager->flush();

            $this->addFlash('success', 'Category created successfully!');
            return $this->redirectToRoute('app_admin_categories');
        }

        return $this->render('admin/category_form.html.twig');
    }
}