package com.tcs.inventory.service;

import com.tcs.inventory.dto.request.PurchaseOrderRequest;
import com.tcs.inventory.dto.response.PurchaseOrderResponse;

import java.util.List;

public interface PurchaseOrderService {

    PurchaseOrderResponse create(PurchaseOrderRequest request);

    PurchaseOrderResponse approve(Long id);

    PurchaseOrderResponse getById(Long id);

    List<PurchaseOrderResponse> getAll();

    void delete(Long id);
}
