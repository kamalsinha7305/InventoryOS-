package com.tcs.inventory.config;

import com.tcs.inventory.entity.*;
import com.tcs.inventory.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedDatabase(
            RoleRepository roleRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            SupplierRepository supplierRepository,
            WarehouseRepository warehouseRepository,
            ProductRepository productRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {

            // ── 1. Roles ──────────────────────────────────────────────────────
            Role adminRole = ensureRole(roleRepository, "Admin", "Full system access");
            Role managerRole = ensureRole(roleRepository, "Manager", "Create and update access");
            Role executiveRole = ensureRole(roleRepository, "Executive", "Read-only access");

            // ── 2. Default users ─────────────────────────────────────────────
            ensureUser(userRepository, passwordEncoder,
                    "admin", "admin123", "admin@inventory.com",
                    "Admin", "User", Set.of(adminRole));
            ensureUser(userRepository, passwordEncoder,
                    "manager", "manager123", "manager@inventory.com",
                    "Manager", "User", Set.of(managerRole));
            ensureUser(userRepository, passwordEncoder,
                    "executive", "executive123", "executive@inventory.com",
                    "Executive", "User", Set.of(executiveRole));

            // ── 3. Categories ─────────────────────────────────────────────────
            Category electronics = ensureCategory(categoryRepository, "Electronics", "Electronic devices and components");
            Category furniture   = ensureCategory(categoryRepository, "Furniture",   "Office and home furniture");
            Category clothing    = ensureCategory(categoryRepository, "Clothing",     "Apparel and accessories");
            Category food        = ensureCategory(categoryRepository, "Food",         "Consumable food products");
            Category tools       = ensureCategory(categoryRepository, "Tools",        "Hardware and tools");

            // ── 4. Suppliers ──────────────────────────────────────────────────
            Supplier techSupplier    = ensureSupplier(supplierRepository, "TechWorld Ltd",    "contact@techworld.com",    "+1-555-0100", "123 Tech Ave, Silicon Valley");
            Supplier furnitureSupply = ensureSupplier(supplierRepository, "FurnishCo",        "sales@furnishco.com",       "+1-555-0200", "456 Oak Street, Chicago");
            Supplier fashionHub      = ensureSupplier(supplierRepository, "FashionHub",        "orders@fashionhub.com",     "+1-555-0300", "789 Style Blvd, New York");
            Supplier foodDistrib     = ensureSupplier(supplierRepository, "Fresh Foods Dist.", "supply@freshfoods.com",     "+1-555-0400", "321 Market Rd, Dallas");
            Supplier toolMaster      = ensureSupplier(supplierRepository, "ToolMaster Inc",    "orders@toolmaster.com",     "+1-555-0500", "654 Industrial Park, Houston");

            // ── 5. Warehouses ─────────────────────────────────────────────────
            ensureWarehouse(warehouseRepository, "Main Warehouse",    "123 Storage Blvd, New York",   5000, 4200, "ACTIVE");
            ensureWarehouse(warehouseRepository, "East Distribution", "456 Freight Ave, Boston",      3000, 2500, "ACTIVE");
            ensureWarehouse(warehouseRepository, "West Hub",          "789 Logistics Rd, Los Angeles",4000, 3600, "ACTIVE");

            Warehouse mainWh = warehouseRepository.findAll().stream().findFirst().orElse(null);

            // ── 6. Sample Products (only if none exist) ───────────────────────
            if (productRepository.count() == 0) {
                createProduct(productRepository, "Laptop Pro 15",        electronics, techSupplier,    1299.99, 5,  50,  "ACTIVE");
                createProduct(productRepository, "Wireless Headphones",  electronics, techSupplier,     149.99, 10, 120, "ACTIVE");
                createProduct(productRepository, "Office Chair Ergonomic",furniture,  furnitureSupply,  299.99, 3,  30,  "ACTIVE");
                createProduct(productRepository, "Standing Desk",        furniture,   furnitureSupply,  499.99, 2,  15,  "ACTIVE");
                createProduct(productRepository, "Classic T-Shirt",      clothing,    fashionHub,        19.99, 20, 200, "ACTIVE");
                createProduct(productRepository, "Running Shoes",        clothing,    fashionHub,        89.99, 10,  80,  "ACTIVE");
                createProduct(productRepository, "Organic Coffee Beans", food,        foodDistrib,       12.99, 30, 150, "ACTIVE");
                createProduct(productRepository, "Power Drill Set",      tools,       toolMaster,        79.99, 5,  60,  "ACTIVE");
            }

            // ── 7. Sample Purchase Orders (if none exist) ────────────────────
            if (purchaseOrderRepository.count() == 0 && mainWh != null) {
                Product laptop = productRepository.findAll().stream().findFirst().orElse(null);
                if (laptop != null && techSupplier != null) {
                    PurchaseOrder po1 = new PurchaseOrder();
                    po1.setPoNumber("PO-2026-001");
                    po1.setQuantity(25);
                    po1.setUnitCost(BigDecimal.valueOf(1100.00));
                    po1.setTotalAmount(BigDecimal.valueOf(27500.00));
                    po1.setStatus("PENDING");
                    po1.setSupplier(techSupplier);
                    po1.setProduct(laptop);
                    po1.setWarehouse(mainWh);
                    purchaseOrderRepository.save(po1);

                    PurchaseOrder po2 = new PurchaseOrder();
                    po2.setPoNumber("PO-2026-002");
                    po2.setQuantity(10);
                    po2.setUnitCost(BigDecimal.valueOf(250.00));
                    po2.setTotalAmount(BigDecimal.valueOf(2500.00));
                    po2.setStatus("PENDING");
                    po2.setSupplier(furnitureSupply);
                    po2.setProduct(laptop);
                    po2.setWarehouse(mainWh);
                    purchaseOrderRepository.save(po2);
                }
            }
        };
    }

    private Role ensureRole(RoleRepository repo, String name, String desc) {
        return repo.findByName(name).orElseGet(() -> {
            Role r = new Role();
            r.setName(name);
            r.setDescription(desc);
            return repo.save(r);
        });
    }

    private void ensureUser(UserRepository repo, PasswordEncoder enc,
                            String username, String password, String email,
                            String firstName, String lastName, Set<Role> roles) {
        if (!repo.existsByUsername(username)) {
            User u = new User();
            u.setUsername(username);
            u.setPassword(enc.encode(password));
            u.setEmail(email);
            u.setFirstName(firstName);
            u.setLastName(lastName);
            u.setEnabled(true);
            u.setRoles(new HashSet<>(roles));
            repo.save(u);
        }
    }

    private Category ensureCategory(CategoryRepository repo, String name, String desc) {
        return repo.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    c.setDescription(desc);
                    return repo.save(c);
                });
    }

    private Supplier ensureSupplier(SupplierRepository repo, String name, String email, String phone, String address) {
        return repo.findAll().stream()
                .filter(s -> s.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> {
                    Supplier s = new Supplier();
                    s.setName(name);
                    s.setContactEmail(email);
                    s.setContactPhone(phone);
                    s.setAddress(address);
                    return repo.save(s);
                });
    }

    private void ensureWarehouse(WarehouseRepository repo, String name, String location, int capacity, int available, String status) {
        boolean exists = repo.findAll().stream()
                .anyMatch(w -> w.getName().equalsIgnoreCase(name));
        if (!exists) {
            Warehouse w = new Warehouse();
            w.setName(name);
            w.setLocation(location);
            w.setCapacity(capacity);
            w.setAvailableCapacity(available);
            w.setStatus(status);
            repo.save(w);
        }
    }

    private void createProduct(ProductRepository repo, String name,
                               Category category, Supplier supplier,
                               double price, int reorderLevel, int stock, String status) {
        Product p = new Product();
        String prefix = name.replaceAll("[^A-Za-z0-9]", "");
        prefix = prefix.length() < 3 ? "PRD" : prefix.substring(0, 3).toUpperCase();
        p.setSku(prefix + "-" + System.nanoTime() % 100000000L);
        p.setName(name);
        p.setUnitPrice(BigDecimal.valueOf(price));
        p.setReorderLevel(reorderLevel);
        p.setCurrentStock(stock);
        p.setStatus(status);
        p.setCategory(category);
        p.setSupplier(supplier);
        repo.save(p);
    }
}
