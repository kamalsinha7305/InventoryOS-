package com.tcs.inventory.service;

import com.tcs.inventory.dto.request.WarehouseRequest;
import com.tcs.inventory.dto.response.WarehouseResponse;

import java.util.List;

public interface WarehouseService {

    WarehouseResponse create(WarehouseRequest request);

    WarehouseResponse update(Long id, WarehouseRequest request);

    WarehouseResponse getById(Long id);

    List<WarehouseResponse> getAll();

    void delete(Long id);
}
