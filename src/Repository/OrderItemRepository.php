<?php

namespace App\Repository;

use App\Entity\OrderItem;
use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OrderItem>
 */
class OrderItemRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OrderItem::class);
    }

    public function findBestSellingProducts(int $limit = 10): array
    {
        return $this->createQueryBuilder('oi')
            ->select('p, SUM(oi.quantity) as totalSold')
            ->join('oi.product', 'p')
            ->join('oi.order', 'o')
            ->where('o.status NOT IN (:excludedStatuses)')
            ->setParameter('excludedStatuses', ['cancelled', 'refunded'])
            ->groupBy('p.id')
            ->orderBy('totalSold', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function getTotalQuantitySoldForProduct(Product $product): int
    {
        $result = $this->createQueryBuilder('oi')
            ->select('SUM(oi.quantity)')
            ->join('oi.order', 'o')
            ->where('oi.product = :product')
            ->andWhere('o.status NOT IN (:excludedStatuses)')
            ->setParameter('product', $product)
            ->setParameter('excludedStatuses', ['cancelled', 'refunded'])
            ->getQuery()
            ->getSingleScalarResult();

        return (int) ($result ?? 0);
    }

    public function getRevenueForProduct(Product $product): float
    {
        $result = $this->createQueryBuilder('oi')
            ->select('SUM(oi.totalPrice)')
            ->join('oi.order', 'o')
            ->where('oi.product = :product')
            ->andWhere('o.status NOT IN (:excludedStatuses)')
            ->setParameter('product', $product)
            ->setParameter('excludedStatuses', ['cancelled', 'refunded'])
            ->getQuery()
            ->getSingleScalarResult();

        return (float) ($result ?? 0);
    }

    public function save(OrderItem $orderItem, bool $flush = false): void
    {
        $this->getEntityManager()->persist($orderItem);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(OrderItem $orderItem, bool $flush = false): void
    {
        $this->getEntityManager()->remove($orderItem);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}