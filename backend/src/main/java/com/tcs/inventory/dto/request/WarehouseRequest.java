package com.tcs.inventory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WarehouseRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    @NotNull
    @Min(0)
    private Integer capacity;

    @Min(0)
    private Integer availableCapacity;

    @NotBlank
    private String status;

    public WarehouseRequest() {}

    public WarehouseRequest(String name, String location, Integer capacity, Integer availableCapacity, String status) {
        this.name = name;
        this.location = location;
        this.capacity = capacity;
        this.availableCapacity = availableCapacity;
        this.status = status;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getAvailableCapacity() { return availableCapacity; }
    public void setAvailableCapacity(Integer availableCapacity) { this.availableCapacity = availableCapacity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
