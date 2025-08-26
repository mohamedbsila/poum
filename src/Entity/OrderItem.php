<?php

namespace App\Entity;

use App\Repository\OrderItemRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderItemRepository::class)]
class OrderItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $unitPrice = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $totalPrice = null;

    #[ORM\Column(length: 255)]
    private ?string $productName = null;

    #[ORM\Column(length: 10, nullable: true)]
    private ?string $productSku = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $productSnapshot = null;

    #[ORM\ManyToOne(inversedBy: 'orderItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Order $order = null;

    #[ORM\ManyToOne(inversedBy: 'orderItems')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Product $product = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;
        $this->calculateTotalPrice();
        return $this;
    }

    public function getUnitPrice(): ?string
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(string $unitPrice): static
    {
        $this->unitPrice = $unitPrice;
        $this->calculateTotalPrice();
        return $this;
    }

    public function getTotalPrice(): ?string
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(string $totalPrice): static
    {
        $this->totalPrice = $totalPrice;
        return $this;
    }

    private function calculateTotalPrice(): void
    {
        if ($this->unitPrice !== null && $this->quantity !== null) {
            $this->totalPrice = (string) ((float)$this->unitPrice * $this->quantity);
        }
    }

    public function getProductName(): ?string
    {
        return $this->productName;
    }

    public function setProductName(string $productName): static
    {
        $this->productName = $productName;
        return $this;
    }

    public function getProductSku(): ?string
    {
        return $this->productSku;
    }

    public function setProductSku(?string $productSku): static
    {
        $this->productSku = $productSku;
        return $this;
    }

    public function getProductSnapshot(): ?array
    {
        return $this->productSnapshot;
    }

    public function setProductSnapshot(?array $productSnapshot): static
    {
        $this->productSnapshot = $productSnapshot;
        return $this;
    }

    public function getOrder(): ?Order
    {
        return $this->order;
    }

    public function setOrder(?Order $order): static
    {
        $this->order = $order;
        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;
        
        if ($product) {
            $this->productName = $product->getName();
            $this->productSku = $product->getSku();
            $this->unitPrice = $product->getPrice();
            
            // Store product snapshot for historical reference
            $this->productSnapshot = [
                'name' => $product->getName(),
                'description' => $product->getShortDescription(),
                'price' => $product->getPrice(),
                'sku' => $product->getSku(),
                'image' => $product->getMainImage(),
            ];
        }
        
        return $this;
    }

    public function getFormattedUnitPrice(): string
    {
        return '$' . number_format((float)$this->unitPrice, 2);
    }

    public function getFormattedTotalPrice(): string
    {
        return '$' . number_format((float)$this->totalPrice, 2);
    }

    public function getProductImage(): ?string
    {
        return $this->productSnapshot['image'] ?? $this->product?->getMainImage();
    }
}