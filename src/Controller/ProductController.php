<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Category;
use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/products')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'app_products')]
    public function index(
        Request $request,
        ProductRepository $productRepository,
        CategoryRepository $categoryRepository
    ): Response {
        $page = $request->query->getInt('page', 1);
        $search = $request->query->get('search', '');
        $categorySlug = $request->query->get('category', '');

        $category = null;
        if ($categorySlug) {
            $category = $categoryRepository->findBySlug($categorySlug);
            if (!$category) {
                throw $this->createNotFoundException('Category not found');
            }
        }

        if ($search) {
            $products = $productRepository->searchByName($search);
            $totalProducts = count($products);
            $products = array_slice($products, ($page - 1) * 12, 12);
        } elseif ($category) {
            $products = $productRepository->findByCategory($category);
            $totalProducts = count($products);
            $products = array_slice($products, ($page - 1) * 12, 12);
        } else {
            $products = $productRepository->findPaginated($page, 12);
            $totalProducts = $productRepository->countActive();
        }

        $totalPages = ceil($totalProducts / 12);
        $categories = $categoryRepository->findWithProducts();

        return $this->render('product/index.html.twig', [
            'products' => $products,
            'categories' => $categories,
            'current_category' => $category,
            'current_page' => $page,
            'total_pages' => $totalPages,
            'search_query' => $search,
            'total_products' => $totalProducts,
        ]);
    }

    #[Route('/{slug}', name: 'app_product_show')]
    public function show(
        string $slug,
        ProductRepository $productRepository
    ): Response {
        $product = $productRepository->findBySlug($slug);
        
        if (!$product) {
            throw $this->createNotFoundException('Product not found');
        }

        $relatedProducts = $productRepository->findRelated($product, 4);

        return $this->render('product/show.html.twig', [
            'product' => $product,
            'related_products' => $relatedProducts,
        ]);
    }

    #[Route('/category/{slug}', name: 'app_category_show')]
    public function category(
        string $slug,
        Request $request,
        CategoryRepository $categoryRepository,
        ProductRepository $productRepository
    ): Response {
        $category = $categoryRepository->findBySlug($slug);
        
        if (!$category) {
            throw $this->createNotFoundException('Category not found');
        }

        $page = $request->query->getInt('page', 1);
        $products = $productRepository->findByCategory($category);
        $totalProducts = count($products);
        $products = array_slice($products, ($page - 1) * 12, 12);
        $totalPages = ceil($totalProducts / 12);

        return $this->render('product/category.html.twig', [
            'category' => $category,
            'products' => $products,
            'current_page' => $page,
            'total_pages' => $totalPages,
            'total_products' => $totalProducts,
        ]);
    }
}