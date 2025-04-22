package com.springboot.backend.Service;

import com.springboot.backend.DTO.VehicleDetailDTO;
import com.springboot.backend.DTO.VehicleSearchDTO;
import com.springboot.backend.Model.Vehicle;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@Service
public interface VehicleService {
    List<VehicleSearchDTO> findToViewHome(int count);
    List<VehicleSearchDTO> findViewAll();
    List<VehicleSearchDTO> findByName(String name);
    List<VehicleSearchDTO> findAll();
    Boolean createVehicle(Vehicle vehicle);
    VehicleDetailDTO getVehicleToEdit(Long id);
    VehicleDetailDTO getVehicleToDetail(Long id);
    VehicleDetailDTO findVehicleToView(Long id);
    Boolean editVehicle(Long id,Vehicle vehicle);
    Boolean deleteVehicle(Long id);
}
