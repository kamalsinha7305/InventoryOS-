package com.tcs.inventory.service.impl;

import com.tcs.inventory.dto.request.ProductRequest;
import com.tcs.inventory.dto.response.ProductResponse;
import com.tcs.inventory.entity.Category;
import com.tcs.inventory.entity.Product;
import com.tcs.inventory.entity.Supplier;
import com.tcs.inventory.exception.ResourceNotFoundException;
import com.tcs.inventory.repository.CategoryRepository;
import com.tcs.inventory.repository.ProductRepository;
import com.tcs.inventory.repository.SupplierRepository;
import com.tcs.inventory.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        product.setSku(generateSku(request.getName()));
        applyRequest(product, request);
        return toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findProduct(id);
        applyRequest(product, request);
        return toResponse(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        return toResponse(findProduct(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        productRepository.delete(findProduct(id));
    }

    private void applyRequest(Product product, ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + request.getSupplierId()));

        product.setName(request.getName());
        product.setUnitPrice(request.getUnitPrice());
        product.setReorderLevel(request.getReorderLevel());
        product.setCurrentStock(request.getCurrentStock() == null ? 0 : request.getCurrentStock());
        product.setStatus(request.getStatus());
        product.setCategory(category);
        product.setSupplier(supplier);
    }

    private Product findProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private String generateSku(String productName) {
        String prefix = productName == null ? "PRD" : productName.replaceAll("[^A-Za-z0-9]", "");
        prefix = prefix.length() < 3 ? "PRD" : prefix.substring(0, 3).toUpperCase(Locale.ROOT);
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getUnitPrice(),
                product.getReorderLevel(),
                product.getCurrentStock(),
                product.getStatus(),
                product.getCategory().getId(),
                product.getCategory().getName(),
                product.getSupplier().getId(),
                product.getSupplier().getName(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
}
