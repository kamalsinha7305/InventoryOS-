package com.tcs.inventory.service.impl;

import com.tcs.inventory.dto.request.WarehouseRequest;
import com.tcs.inventory.dto.response.WarehouseResponse;
import com.tcs.inventory.entity.Warehouse;
import com.tcs.inventory.exception.ResourceNotFoundException;
import com.tcs.inventory.repository.WarehouseRepository;
import com.tcs.inventory.repository.PurchaseOrderRepository;
import com.tcs.inventory.service.WarehouseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public WarehouseServiceImpl(WarehouseRepository warehouseRepository, PurchaseOrderRepository purchaseOrderRepository) {
        this.warehouseRepository = warehouseRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    public WarehouseResponse create(WarehouseRequest request) {
        Warehouse warehouse = new Warehouse();
        applyRequest(warehouse, request);
        return toResponse(warehouseRepository.save(warehouse));
    }

    @Override
    public WarehouseResponse update(Long id, WarehouseRequest request) {
        Warehouse warehouse = findWarehouse(id);
        applyRequest(warehouse, request);
        return toResponse(warehouseRepository.save(warehouse));
    }

    @Override
    @Transactional(readOnly = true)
    public WarehouseResponse getById(Long id) {
        return toResponse(findWarehouse(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseResponse> getAll() {
        return warehouseRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (purchaseOrderRepository.existsByWarehouseId(id)) {
            throw new IllegalArgumentException("Cannot delete warehouse with existing purchase orders");
        }
        warehouseRepository.delete(findWarehouse(id));
    }

    private void applyRequest(Warehouse warehouse, WarehouseRequest request) {
        int availableCapacity = request.getAvailableCapacity() == null
                ? request.getCapacity()
                : request.getAvailableCapacity();

        if (availableCapacity > request.getCapacity()) {
            throw new IllegalArgumentException("Available capacity cannot be greater than total capacity");
        }

        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setCapacity(request.getCapacity());
        warehouse.setAvailableCapacity(availableCapacity);
        warehouse.setStatus(request.getStatus());
    }

    private Warehouse findWarehouse(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with id: " + id));
    }

    private WarehouseResponse toResponse(Warehouse warehouse) {
        return new WarehouseResponse(
                warehouse.getId(),
                warehouse.getName(),
                warehouse.getLocation(),
                warehouse.getCapacity(),
                warehouse.getAvailableCapacity(),
                warehouse.getStatus(),
                warehouse.getCreatedAt(),
                warehouse.getUpdatedAt()
        );
    }
}
