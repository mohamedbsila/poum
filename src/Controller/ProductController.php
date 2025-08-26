<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/products')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'app_products')]
    public function index(ProductRepository $productRepository, CategoryRepository $categoryRepository, Request $request): Response
    {
        $categoryId = $request->query->get('category');
        $products = [];
        $categories = $categoryRepository->findAll();

        if ($categoryId) {
            $products = $productRepository->findByCategory($categoryId);
        } else {
            $products = $productRepository->findActiveProducts();
        }

        return $this->render('product/index.html.twig', [
            'products' => $products,
            'categories' => $categories,
            'selected_category' => $categoryId,
        ]);
    }

    #[Route('/{id}', name: 'app_product_show')]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }
}