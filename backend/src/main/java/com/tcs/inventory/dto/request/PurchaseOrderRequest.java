package com.tcs.inventory.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class PurchaseOrderRequest {

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal unitCost;

    @NotNull
    private Long supplierId;

    @NotNull
    private Long productId;

    @NotNull
    private Long warehouseId;

    public PurchaseOrderRequest() {}

    public PurchaseOrderRequest(Integer quantity, BigDecimal unitCost, Long supplierId, Long productId, Long warehouseId) {
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.supplierId = supplierId;
        this.productId = productId;
        this.warehouseId = warehouseId;
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
}
