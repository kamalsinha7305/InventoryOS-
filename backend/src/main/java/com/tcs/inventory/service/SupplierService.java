package com.tcs.inventory.service;

import com.tcs.inventory.dto.request.SupplierRequest;
import com.tcs.inventory.dto.response.SupplierResponse;

import java.util.List;

public interface SupplierService {
    SupplierResponse create(SupplierRequest request);
    SupplierResponse update(Long id, SupplierRequest request);
    SupplierResponse getById(Long id);
    List<SupplierResponse> getAll();
    void delete(Long id);
}
