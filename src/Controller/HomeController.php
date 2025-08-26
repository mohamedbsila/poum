<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(ProductRepository $productRepository, CategoryRepository $categoryRepository): Response
    {
        $featuredProducts = $productRepository->findActiveProducts();
        $categories = $categoryRepository->findAll();

        return $this->render('home/index.html.twig', [
            'featured_products' => array_slice($featuredProducts, 0, 8),
            'categories' => $categories,
        ]);
    }

    #[Route('/search', name: 'app_search')]
    public function search(Request $request, ProductRepository $productRepository): Response
    {
        $query = $request->query->get('q', '');
        $products = [];

        if ($query) {
            $products = $productRepository->searchProducts($query);
        }

        return $this->render('home/search.html.twig', [
            'products' => $products,
            'query' => $query,
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

    #[Route('/change-locale/{locale}', name: 'app_change_locale')]
    public function changeLocale(string $locale, Request $request): Response
    {
        $request->getSession()->set('_locale', $locale);
        
        return $this->redirectToRoute('app_home');
    }
}