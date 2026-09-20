package com.tcs.inventory.repository;

import com.tcs.inventory.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
	boolean existsByWarehouseId(Long warehouseId);
}
