package com.tcs.inventory.service;

import com.tcs.inventory.dto.request.ProductRequest;
import com.tcs.inventory.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse create(ProductRequest request);

    ProductResponse update(Long id, ProductRequest request);

    ProductResponse getById(Long id);

    List<ProductResponse> getAll();

    void delete(Long id);
}
