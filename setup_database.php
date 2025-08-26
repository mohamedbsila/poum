<?php

require_once 'vendor/autoload.php';

use Symfony\Component\Dotenv\Dotenv;
use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Tools\Setup;
use App\Entity\User;
use App\Entity\Category;
use App\Entity\Product;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

// Load environment variables
$dotenv = new Dotenv();
$dotenv->load('.env');

// Database connection
$connectionParams = [
    'url' => $_ENV['DATABASE_URL']
];

try {
    // Create database connection
    $connection = DriverManager::getConnection($connectionParams);
    
    // Create database if it doesn't exist
    $dbName = 'ecommerce_db';
    $connection->executeStatement("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $connection->executeStatement("USE `$dbName`");
    
    echo "Database created successfully!\n";
    
    // Create tables using Doctrine
    $config = Setup::createAttributeMetadataConfiguration([__DIR__ . '/src/Entity'], true);
    $entityManager = EntityManager::create($connectionParams, $config);
    
    // Create schema
    $schemaTool = new \Doctrine\ORM\Tools\SchemaTool($entityManager);
    $metadata = $entityManager->getMetadataFactory()->getAllMetadata();
    $schemaTool->createSchema($metadata);
    
    echo "Tables created successfully!\n";
    
    // Create admin user
    $adminUser = new User();
    $adminUser->setEmail('admin@ecommerce.tn');
    $adminUser->setFirstName('Admin');
    $adminUser->setLastName('User');
    $adminUser->setPassword(password_hash('admin123', PASSWORD_DEFAULT));
    $adminUser->setRoles(['ROLE_ADMIN']);
    $adminUser->setPhone('+216 XX XXX XXX');
    $adminUser->setAddress('Tunis, Tunisia');
    
    $entityManager->persist($adminUser);
    
    // Create sample categories
    $categories = [
        ['name' => 'Électronique', 'description' => 'Produits électroniques et gadgets'],
        ['name' => 'Vêtements', 'description' => 'Mode et accessoires'],
        ['name' => 'Maison', 'description' => 'Articles pour la maison'],
        ['name' => 'Sport', 'description' => 'Équipements sportifs'],
        ['name' => 'Livres', 'description' => 'Livres et publications']
    ];
    
    $categoryEntities = [];
    foreach ($categories as $catData) {
        $category = new Category();
        $category->setName($catData['name']);
        $category->setDescription($catData['description']);
        $entityManager->persist($category);
        $categoryEntities[] = $category;
    }
    
    // Create sample products
    $products = [
        [
            'name' => 'Smartphone Samsung Galaxy',
            'description' => 'Smartphone moderne avec écran 6.1 pouces, 128GB de stockage',
            'price' => 899.99,
            'stock' => 15,
            'category' => 0
        ],
        [
            'name' => 'Laptop HP Pavilion',
            'description' => 'Ordinateur portable 15.6 pouces, Intel i5, 8GB RAM',
            'price' => 1299.99,
            'stock' => 8,
            'category' => 0
        ],
        [
            'name' => 'T-shirt Premium',
            'description' => 'T-shirt en coton bio, design moderne',
            'price' => 29.99,
            'stock' => 50,
            'category' => 1
        ],
        [
            'name' => 'Jeans Classic',
            'description' => 'Jeans confortable, coupe slim',
            'price' => 59.99,
            'stock' => 30,
            'category' => 1
        ],
        [
            'name' => 'Lampe de Bureau LED',
            'description' => 'Lampe moderne avec éclairage LED ajustable',
            'price' => 45.99,
            'stock' => 25,
            'category' => 2
        ],
        [
            'name' => 'Ballon de Football',
            'description' => 'Ballon professionnel, taille 5',
            'price' => 35.99,
            'stock' => 20,
            'category' => 3
        ],
        [
            'name' => 'Roman Bestseller',
            'description' => 'Livre à succès, édition limitée',
            'price' => 19.99,
            'stock' => 100,
            'category' => 4
        ],
        [
            'name' => 'Casque Audio Sans Fil',
            'description' => 'Casque Bluetooth avec réduction de bruit',
            'price' => 129.99,
            'stock' => 12,
            'category' => 0
        ]
    ];
    
    foreach ($products as $prodData) {
        $product = new Product();
        $product->setName($prodData['name']);
        $product->setDescription($prodData['description']);
        $product->setPrice($prodData['price']);
        $product->setStock($prodData['stock']);
        $product->setCategory($categoryEntities[$prodData['category']]);
        $product->setIsActive(true);
        
        $entityManager->persist($product);
    }
    
    // Flush all changes
    $entityManager->flush();
    
    echo "Sample data created successfully!\n";
    echo "Admin credentials:\n";
    echo "Email: admin@ecommerce.tn\n";
    echo "Password: admin123\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}