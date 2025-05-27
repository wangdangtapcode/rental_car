package com.springboot.backend.Service;

import com.springboot.backend.Model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface VehicleService {

    List<Vehicle> findByName(String name);

    List<Vehicle> findAll();

    Boolean createVehicle(Vehicle vehicle);

    Boolean editVehicle(Long id, Vehicle vehicle);

    Boolean deleteVehicle(Long id);

    List<Vehicle> findAvailableVehicles(String startDate, String endDate);

    List<Vehicle> findCurrentlyAvailableVehicles();
}
