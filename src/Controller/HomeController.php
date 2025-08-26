<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(
        ProductRepository $productRepository,
        CategoryRepository $categoryRepository
    ): Response {
        $featuredProducts = $productRepository->findFeatured(8);
        $categories = $categoryRepository->findRootCategories();
        $onSaleProducts = $productRepository->findOnSale();

        return $this->render('home/index.html.twig', [
            'featured_products' => $featuredProducts,
            'categories' => $categories,
            'on_sale_products' => array_slice($onSaleProducts, 0, 4),
        ]);
    }

    #[Route('/about', name: 'app_about')]
    public function about(): Response
    {
        return $this->render('home/about.html.twig');
    }

    #[Route('/contact', name: 'app_contact')]
    public function contact(): Response
    {
        return $this->render('home/contact.html.twig');
    }
}