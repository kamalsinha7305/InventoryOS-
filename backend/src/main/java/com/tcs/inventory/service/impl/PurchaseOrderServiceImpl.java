package com.tcs.inventory.service.impl;

import com.tcs.inventory.dto.request.PurchaseOrderRequest;
import com.tcs.inventory.dto.response.PurchaseOrderResponse;
import com.tcs.inventory.entity.Product;
import com.tcs.inventory.entity.PurchaseOrder;
import com.tcs.inventory.entity.Supplier;
import com.tcs.inventory.entity.Warehouse;
import com.tcs.inventory.exception.ResourceNotFoundException;
import com.tcs.inventory.repository.ProductRepository;
import com.tcs.inventory.repository.PurchaseOrderRepository;
import com.tcs.inventory.repository.SupplierRepository;
import com.tcs.inventory.repository.WarehouseRepository;
import com.tcs.inventory.service.PurchaseOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public PurchaseOrderServiceImpl(
            PurchaseOrderRepository purchaseOrderRepository,
            SupplierRepository supplierRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository
    ) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    @Override
    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        PurchaseOrder purchaseOrder = new PurchaseOrder();
        purchaseOrder.setPoNumber(generatePoNumber());
        purchaseOrder.setQuantity(request.getQuantity());
        purchaseOrder.setUnitCost(request.getUnitCost());
        purchaseOrder.setTotalAmount(BigDecimal.ZERO);
        purchaseOrder.setStatus(STATUS_PENDING);
        purchaseOrder.setSupplier(findSupplier(request.getSupplierId()));
        purchaseOrder.setProduct(findProduct(request.getProductId()));
        purchaseOrder.setWarehouse(findWarehouse(request.getWarehouseId()));
        return toResponse(purchaseOrderRepository.save(purchaseOrder));
    }

    @Override
    public PurchaseOrderResponse approve(Long id) {
        PurchaseOrder purchaseOrder = findPurchaseOrder(id);

        if (STATUS_APPROVED.equalsIgnoreCase(purchaseOrder.getStatus())) {
            throw new IllegalArgumentException("Purchase order is already approved");
        }

        Product product = purchaseOrder.getProduct();
        Warehouse warehouse = purchaseOrder.getWarehouse();
        int quantity = purchaseOrder.getQuantity();

        if (warehouse.getAvailableCapacity() < quantity) {
            throw new IllegalArgumentException("Warehouse does not have enough available capacity");
        }

        purchaseOrder.setTotalAmount(purchaseOrder.getUnitCost().multiply(BigDecimal.valueOf(quantity)));
        purchaseOrder.setStatus(STATUS_APPROVED);

        product.setCurrentStock(product.getCurrentStock() + quantity);
        warehouse.setAvailableCapacity(warehouse.getAvailableCapacity() - quantity);

        productRepository.save(product);
        warehouseRepository.save(warehouse);
        return toResponse(purchaseOrderRepository.save(purchaseOrder));
    }

    @Override
    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(Long id) {
        return toResponse(findPurchaseOrder(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> getAll() {
        return purchaseOrderRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        purchaseOrderRepository.delete(findPurchaseOrder(id));
    }

    private Supplier findSupplier(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + id));
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private Warehouse findWarehouse(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));
    }

    private PurchaseOrder findPurchaseOrder(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase order not found with id: " + id));
    }

    private String generatePoNumber() {
        return "PO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private PurchaseOrderResponse toResponse(PurchaseOrder purchaseOrder) {
        return new PurchaseOrderResponse(
                purchaseOrder.getId(),
                purchaseOrder.getPoNumber(),
                purchaseOrder.getQuantity(),
                purchaseOrder.getUnitCost(),
                purchaseOrder.getTotalAmount(),
                purchaseOrder.getStatus(),
                purchaseOrder.getSupplier().getId(),
                purchaseOrder.getSupplier().getName(),
                purchaseOrder.getProduct().getId(),
                purchaseOrder.getProduct().getName(),
                purchaseOrder.getWarehouse().getId(),
                purchaseOrder.getWarehouse().getName(),
                purchaseOrder.getCreatedAt(),
                purchaseOrder.getUpdatedAt()
        );
    }
}
