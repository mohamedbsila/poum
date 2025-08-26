<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Create Categories
        $airpodsCategory = new Category();
        $airpodsCategory->setName('AirPods')
            ->setSlug('airpods')
            ->setDescription('Premium wireless earbuds with exceptional sound quality')
            ->setSortOrder(1);
        $manager->persist($airpodsCategory);

        $airpodsProCategory = new Category();
        $airpodsProCategory->setName('AirPods Pro')
            ->setSlug('airpods-pro')
            ->setDescription('Professional-grade wireless earbuds with active noise cancellation')
            ->setParent($airpodsCategory)
            ->setSortOrder(1);
        $manager->persist($airpodsProCategory);

        $airpodsMaxCategory = new Category();
        $airpodsMaxCategory->setName('AirPods Max')
            ->setSlug('airpods-max')
            ->setDescription('Over-ear headphones with exceptional audio quality')
            ->setParent($airpodsCategory)
            ->setSortOrder(2);
        $manager->persist($airpodsMaxCategory);

        $accessoriesCategory = new Category();
        $accessoriesCategory->setName('Accessories')
            ->setSlug('accessories')
            ->setDescription('Cases, chargers, and other accessories for your AirPods')
            ->setSortOrder(2);
        $manager->persist($accessoriesCategory);

        // Create Products
        $products = [
            [
                'name' => 'AirPods Pro (2nd generation)',
                'slug' => 'airpods-pro-2nd-gen',
                'shortDescription' => 'Active Noise Cancellation, Transparency mode, and spatial audio',
                'description' => 'AirPods Pro (2nd generation) deliver up to 2x more Active Noise Cancellation, plus Transparency mode, and now Adaptive Transparency. Spatial Audio takes immersion to a remarkably personal level. And with multiple ear tip sizes, they offer a customizable fit for all-day comfort.',
                'price' => '249.00',
                'originalPrice' => '279.00',
                'sku' => 'APP2G-001',
                'stock' => 50,
                'isFeatured' => true,
                'category' => $airpodsProCategory,
                'images' => ['airpods-pro-2nd-gen.jpg'],
                'specifications' => [
                    'Battery Life' => 'Up to 6 hours listening time with ANC on',
                    'Charging Case' => 'Up to 30 hours total listening time',
                    'Water Resistance' => 'IPX4 rated',
                    'Chip' => 'Apple H2 chip',
                    'Audio' => 'Adaptive EQ, Spatial Audio with dynamic head tracking'
                ],
                'tags' => ['noise-cancellation', 'spatial-audio', 'wireless']
            ],
            [
                'name' => 'AirPods (3rd generation)',
                'slug' => 'airpods-3rd-gen',
                'shortDescription' => 'Spatial audio and longer battery life in a new contoured design',
                'description' => 'AirPods (3rd generation) feature spatial audio that places sound all around you, plus longer battery life and a Lightning Charging Case. The new contoured design and shorter stem provide a more comfortable fit.',
                'price' => '179.00',
                'originalPrice' => '199.00',
                'sku' => 'AP3G-001',
                'stock' => 75,
                'isFeatured' => true,
                'category' => $airpodsCategory,
                'images' => ['airpods-3rd-gen.jpg'],
                'specifications' => [
                    'Battery Life' => 'Up to 6 hours listening time',
                    'Charging Case' => 'Up to 30 hours total listening time',
                    'Water Resistance' => 'IPX4 rated',
                    'Chip' => 'Apple H1 chip',
                    'Audio' => 'Adaptive EQ, Spatial Audio'
                ],
                'tags' => ['spatial-audio', 'wireless', 'comfortable']
            ],
            [
                'name' => 'AirPods Max',
                'slug' => 'airpods-max',
                'shortDescription' => 'Premium over-ear headphones with Active Noise Cancellation',
                'description' => 'AirPods Max deliver stunningly detailed, high-fidelity audio for an unparalleled listening experience. Each part of the custom-built driver works to produce sound with ultra-low distortion across the audible range.',
                'price' => '549.00',
                'originalPrice' => null,
                'sku' => 'APM-001',
                'stock' => 25,
                'isFeatured' => true,
                'category' => $airpodsMaxCategory,
                'images' => ['airpods-max.jpg'],
                'specifications' => [
                    'Battery Life' => 'Up to 20 hours with ANC on',
                    'Weight' => '384.8 grams',
                    'Colors' => 'Space Gray, Silver, Sky Blue, Green, Pink',
                    'Chip' => 'Apple H1 chip',
                    'Audio' => 'Active Noise Cancellation, Transparency mode, Spatial Audio'
                ],
                'tags' => ['premium', 'over-ear', 'noise-cancellation']
            ],
            [
                'name' => 'AirPods Pro (1st generation)',
                'slug' => 'airpods-pro-1st-gen',
                'shortDescription' => 'Active Noise Cancellation in a compact design',
                'description' => 'AirPods Pro (1st generation) bring Active Noise Cancellation to an in-ear design, giving you immersive sound that tunes out the noise around you.',
                'price' => '199.00',
                'originalPrice' => '249.00',
                'sku' => 'APP1G-001',
                'stock' => 30,
                'isFeatured' => false,
                'category' => $airpodsProCategory,
                'images' => ['airpods-pro-1st-gen.jpg'],
                'specifications' => [
                    'Battery Life' => 'Up to 4.5 hours listening time with ANC on',
                    'Charging Case' => 'Up to 24 hours total listening time',
                    'Water Resistance' => 'IPX4 rated',
                    'Chip' => 'Apple H1 chip',
                    'Audio' => 'Active Noise Cancellation, Transparency mode'
                ],
                'tags' => ['noise-cancellation', 'compact', 'wireless']
            ],
            [
                'name' => 'AirPods (2nd generation)',
                'slug' => 'airpods-2nd-gen',
                'shortDescription' => 'Effortless wireless experience with the H1 chip',
                'description' => 'AirPods (2nd generation) deliver rich, high-quality AAC audio. And with up to 5 hours of listening time and the quick-charging case, they\'re perfect for all-day use.',
                'price' => '129.00',
                'originalPrice' => '159.00',
                'sku' => 'AP2G-001',
                'stock' => 100,
                'isFeatured' => false,
                'category' => $airpodsCategory,
                'images' => ['airpods-2nd-gen.jpg'],
                'specifications' => [
                    'Battery Life' => 'Up to 5 hours listening time',
                    'Charging Case' => 'Up to 24 hours total listening time',
                    'Chip' => 'Apple H1 chip',
                    'Audio' => 'AAC audio, automatic switching'
                ],
                'tags' => ['affordable', 'wireless', 'h1-chip']
            ],
            [
                'name' => 'AirPods Pro Silicone Tips',
                'slug' => 'airpods-pro-silicone-tips',
                'shortDescription' => 'Replacement silicone ear tips for AirPods Pro',
                'description' => 'Get the perfect fit with these replacement silicone ear tips for AirPods Pro. Available in small, medium, and large sizes.',
                'price' => '19.00',
                'originalPrice' => null,
                'sku' => 'APST-001',
                'stock' => 200,
                'isFeatured' => false,
                'category' => $accessoriesCategory,
                'images' => ['airpods-pro-tips.jpg'],
                'specifications' => [
                    'Compatibility' => 'AirPods Pro (1st and 2nd generation)',
                    'Sizes' => 'Small, Medium, Large (2 pairs each)',
                    'Material' => 'Soft silicone'
                ],
                'tags' => ['replacement', 'comfort', 'fit']
            ],
            [
                'name' => 'MagSafe Charging Case for AirPods Pro',
                'slug' => 'magsafe-charging-case-airpods-pro',
                'shortDescription' => 'Wireless charging case with MagSafe compatibility',
                'description' => 'The MagSafe Charging Case for AirPods Pro delivers more than 24 hours of battery life and features wireless charging with MagSafe and Qi compatibility.',
                'price' => '99.00',
                'originalPrice' => null,
                'sku' => 'MSCC-001',
                'stock' => 50,
                'isFeatured' => false,
                'category' => $accessoriesCategory,
                'images' => ['magsafe-case.jpg'],
                'specifications' => [
                    'Compatibility' => 'AirPods Pro',
                    'Charging' => 'MagSafe wireless charging, Qi wireless charging, Lightning',
                    'Battery Life' => 'More than 24 hours total listening time'
                ],
                'tags' => ['magsafe', 'wireless-charging', 'replacement']
            ],
            [
                'name' => 'AirPods Leather Case',
                'slug' => 'airpods-leather-case',
                'shortDescription' => 'Premium leather protection for your AirPods',
                'description' => 'Crafted from specially tanned and finished European leather, this case provides elegant protection for your AirPods charging case.',
                'price' => '35.00',
                'originalPrice' => null,
                'sku' => 'ALC-001',
                'stock' => 75,
                'isFeatured' => false,
                'category' => $accessoriesCategory,
                'images' => ['leather-case.jpg'],
                'specifications' => [
                    'Material' => 'European leather',
                    'Compatibility' => 'AirPods (2nd and 3rd generation)',
                    'Colors' => 'Black, Brown, Midnight'
                ],
                'tags' => ['premium', 'protection', 'leather']
            ]
        ];

        foreach ($products as $productData) {
            $product = new Product();
            $product->setName($productData['name'])
                ->setSlug($productData['slug'])
                ->setShortDescription($productData['shortDescription'])
                ->setDescription($productData['description'])
                ->setPrice($productData['price'])
                ->setOriginalPrice($productData['originalPrice'])
                ->setSku($productData['sku'])
                ->setStock($productData['stock'])
                ->setIsFeatured($productData['isFeatured'])
                ->setCategory($productData['category'])
                ->setImages($productData['images'])
                ->setSpecifications($productData['specifications'])
                ->setTags($productData['tags'])
                ->setSortOrder(1);

            $manager->persist($product);
        }

        $manager->flush();
    }
}