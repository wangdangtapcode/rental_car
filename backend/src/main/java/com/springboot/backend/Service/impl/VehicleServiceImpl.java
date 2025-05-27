package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.Vehicle;
import com.springboot.backend.Model.VehicleImage;
import com.springboot.backend.Repository.VehicleImageRepository;
import com.springboot.backend.Repository.VehicleRepository;
import com.springboot.backend.Service.VehicleService;
import com.springboot.backend.Utils.ImageUtils;
import com.springboot.backend.Utils.LogUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private final VehicleRepository vehicleRepository;
    @Autowired
    private final VehicleImageRepository vehicleImageRepository;

    @Override
    public List<Vehicle> findByName(String name) {
        List<Vehicle> vehicles = vehicleRepository.findFirst20ByNameContainingIgnoreCase(name);
        for (Vehicle vehicle : vehicles) {
            for (VehicleImage vehicleImage : vehicle.getVehicleImages()) {
                String imgBase64 = ImageUtils.encodeToBase64(vehicleImage.getImageData());
                String imageUri = "data:" + vehicleImage.getType() + ";base64," + imgBase64;
                vehicleImage.setImageUri(imageUri);
            }
        }
        return vehicles;
    }

    @Override
    public List<Vehicle> findAll() {
        List<Vehicle> vehicles = vehicleRepository.findTop20ByOrderByIdAsc();
        for (Vehicle vehicle : vehicles) {
            for (VehicleImage vehicleImage : vehicle.getVehicleImages()) {
                String imgBase64 = ImageUtils.encodeToBase64(vehicleImage.getImageData());
                String imageUri = "data:" + vehicleImage.getType() + ";base64," + imgBase64;
                vehicleImage.setImageUri(imageUri);
            }
        }
        return vehicles;
    }

    @Override
    @Transactional
    public Boolean createVehicle(Vehicle vehicle) {
        try {
            if (vehicle.getVehicleImages() != null) {
                for (VehicleImage image : vehicle.getVehicleImages()) {
                    image.setVehicle(vehicle);
                    if (image.getImageData() != null) {
                        image.setImageData(ImageUtils.compressImage(image.getImageData()));
                    }
                }
            }
            vehicleRepository.save(vehicle);
            LogUtils.info(this.getClass().getSimpleName(), "createVehicle",
                    "Vehicle created successfully");
            return true;
        } catch (Exception e) {
            LogUtils.logException(this.getClass().getSimpleName(), "createVehicle",
                    "Error creating vehicle", e);
            return false;
        }
    }

    @Override
    @Transactional
    public Boolean editVehicle(Long id, Vehicle vehicle) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle existingVehicle = optionalVehicle.get();

            try {
                existingVehicle.setName(vehicle.getName());
                existingVehicle.setLicensePlate(vehicle.getLicensePlate());
                existingVehicle.setBrand(vehicle.getBrand());
                existingVehicle.setType(vehicle.getType());
                existingVehicle.setSeatCount(vehicle.getSeatCount());
                existingVehicle.setManufactureYear(vehicle.getManufactureYear());
                existingVehicle.setRentalPrice(vehicle.getRentalPrice());
                existingVehicle.setVehicleCondition(vehicle.getVehicleCondition());
                existingVehicle.setOwnerType(vehicle.getOwnerType());
                existingVehicle.setDescription(vehicle.getDescription());

                if (vehicle.getVehicleImages() != null) {
                    List<VehicleImage> existingImages = existingVehicle.getVehicleImages();
                    List<VehicleImage> newImages = vehicle.getVehicleImages();
                    existingImages
                            .removeIf(existingImage -> newImages.stream().noneMatch(newImage -> newImage.getId() != null
                                    && newImage.getId().equals(existingImage.getId())));
                    for (VehicleImage newImage : newImages) {
                        if (newImage.getId() == null) { // Ảnh mới
                            newImage.setVehicle(existingVehicle);
                            if (newImage.getImageData() != null) {
                                newImage.setImageData(ImageUtils.compressImage(newImage.getImageData()));
                            }
                            existingImages.add(newImage);
                        } else { // Cập nhật ảnh cũ
                            for (VehicleImage existingImage : existingImages) {
                                if (existingImage.getId().equals(newImage.getId())) {
                                    // existingImage.setName(newImage.getName());
                                    // existingImage.setType(newImage.getType());
                                    existingImage.setIsThumbnail(newImage.getIsThumbnail());
                                    // if (newImage.getImageData() != null) {
                                    // existingImage.setImageData(ImageUtils.compressImage(newImage.getImageData()));
                                    // }
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    existingVehicle.getVehicleImages().clear();
                }

                vehicleRepository.save(existingVehicle);
                return true;
            } catch (IOException e) {
                System.err.println("Error compressing image: " + e.getMessage());
                return false;
            }
        } else {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
    }

    @Override
    @Transactional
    public Boolean deleteVehicle(Long id) {
        try {
            if (!vehicleRepository.existsById(id)) {
                return false;
            }
            vehicleRepository.deleteById(id);
            LogUtils.info(getClass().getSimpleName(), "deleteVehicle",
                    "Vehicle deleted successfully with ID: " + id);
            return true;
        } catch (Exception e) {
            LogUtils.logException(getClass().getSimpleName(), "deleteVehicle",
                    "Error deleting vehicle", e);
            return false;
        }
    }

    @Override
    public List<Vehicle> findAvailableVehicles(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        // Lấy danh sách xe đã được đặt trong khoảng thời gian này
        List<Vehicle> bookedVehicles = vehicleRepository.findBookedVehicles(start, end);

        // Lấy tất cả xe
        List<Vehicle> allVehicles = vehicleRepository.findAll();

        // Lọc ra những xe chưa được đặt
        List<Vehicle> availableVehicles = allVehicles.stream()
                .filter(vehicle -> !bookedVehicles.contains(vehicle))
                .collect(Collectors.toList());

        // Xử lý ảnh cho mỗi xe
        for (Vehicle vehicle : availableVehicles) {
            for (VehicleImage vehicleImage : vehicle.getVehicleImages()) {
                String imgBase64 = ImageUtils.encodeToBase64(vehicleImage.getImageData());
                String imageUri = "data:" + vehicleImage.getType() + ";base64," + imgBase64;
                vehicleImage.setImageUri(imageUri);
            }
        }

        return availableVehicles;
    }

    @Override
    public List<Vehicle> findCurrentlyAvailableVehicles() {
        List<Vehicle> availableVehicles = vehicleRepository.findCurrentlyAvailableVehicles();

        // Xử lý ảnh cho mỗi xe
        for (Vehicle vehicle : availableVehicles) {
            for (VehicleImage vehicleImage : vehicle.getVehicleImages()) {
                String imgBase64 = ImageUtils.encodeToBase64(vehicleImage.getImageData());
                String imageUri = "data:" + vehicleImage.getType() + ";base64," + imgBase64;
                vehicleImage.setImageUri(imageUri);
            }
        }

        return availableVehicles;
    }

}
