package com.springboot.backend.Service;

import com.springboot.backend.Model.Vehicle;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface VehicleService {
    List<Vehicle> findToViewHome(int count);
    List<Vehicle> findVehicleActiveAll();
    List<Vehicle> findByName(String name);
    List<Vehicle> findAll();
    Boolean createVehicle(Vehicle vehicle);
    Vehicle getVehicleToEdit(Long id);
    Vehicle getVehicleToDetail(Long id);
    Vehicle findVehicleToView(Long id);
    Boolean editVehicle(Long id,Vehicle vehicle);
    Boolean deleteVehicle(Long id);
}
