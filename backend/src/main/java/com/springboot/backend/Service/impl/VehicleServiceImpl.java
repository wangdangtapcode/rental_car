package com.springboot.backend.Service.impl;

import com.springboot.backend.DTO.VehicleImageDTO;
import com.springboot.backend.DTO.VehicleDetailDTO;
import com.springboot.backend.DTO.VehicleSearchDTO;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    @Autowired
    private final VehicleRepository vehicleRepository;
    @Autowired
    private final VehicleImageRepository vehicleImageRepository;

    @Override
    public List<VehicleSearchDTO> findToViewHome(int count) {
        List<Vehicle> vehicles = vehicleRepository.findRandomToViewHome(count);
        if(vehicles.size() != count) return null;
        List<VehicleSearchDTO> vehicleSearchDTOS = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            VehicleSearchDTO vehicleSearchDTO = new VehicleSearchDTO();
            vehicleSearchDTO.setId(vehicle.getId());
            vehicleSearchDTO.setName(vehicle.getName());
            vehicleSearchDTO.setBrand(vehicle.getBrand());
            vehicleSearchDTO.setType(vehicle.getType());
            vehicleSearchDTO.setSeatCount(vehicle.getSeatCount());
            vehicleSearchDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleSearchDTO.setDescription(vehicle.getDescription());
            VehicleImage thumbnail = vehicleImageRepository.findByVehicleIdAndIsThumbnailIsTrue(vehicle.getId());
            if (thumbnail != null ) {
                String base64Image = ImageUtils.encodeToBase64(thumbnail.getImageData());
                String base64WithPrefix = "data:" + thumbnail.getType() + ";base64," + base64Image;

                vehicleSearchDTO.setThumbnailImage(base64WithPrefix);
            } else {
                vehicleSearchDTO.setThumbnailImage("");
            }

            vehicleSearchDTOS.add(vehicleSearchDTO);
        }


        return vehicleSearchDTOS;
    }

    @Override
    public List<VehicleSearchDTO> findViewAll() {
        List<Vehicle> vehicles = vehicleRepository.findViewAll();
        List<VehicleSearchDTO> vehicleSearchDTOS = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            VehicleSearchDTO vehicleSearchDTO = new VehicleSearchDTO();
            vehicleSearchDTO.setId(vehicle.getId());
            vehicleSearchDTO.setName(vehicle.getName());
            vehicleSearchDTO.setBrand(vehicle.getBrand());
            vehicleSearchDTO.setType(vehicle.getType());
            vehicleSearchDTO.setSeatCount(vehicle.getSeatCount());
            vehicleSearchDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleSearchDTO.setDescription(vehicle.getDescription());
            VehicleImage thumbnail = vehicleImageRepository.findByVehicleIdAndIsThumbnailIsTrue(vehicle.getId());
            if (thumbnail != null ) {
                String base64Image = ImageUtils.encodeToBase64(thumbnail.getImageData());
                String base64WithPrefix = "data:" + thumbnail.getType() + ";base64," + base64Image;

                vehicleSearchDTO.setThumbnailImage(base64WithPrefix);
            } else {
                vehicleSearchDTO.setThumbnailImage("");
            }

            vehicleSearchDTOS.add(vehicleSearchDTO);
        }


        return vehicleSearchDTOS;
    }

    @Override
    public List<VehicleSearchDTO> findByName(String name) {
        List<Vehicle> vehicles = vehicleRepository.findFirst20ByNameContaining(name);
        List<VehicleSearchDTO> vehicleSearchDTOS = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            VehicleSearchDTO vehicleSearchDTO = new VehicleSearchDTO();
            vehicleSearchDTO.setId(vehicle.getId());
            vehicleSearchDTO.setName(vehicle.getName());
            vehicleSearchDTO.setBrand(vehicle.getBrand());
            vehicleSearchDTO.setType(vehicle.getType());
            vehicleSearchDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleSearchDTO.setLicensePlate(vehicle.getLicensePlate());
            vehicleSearchDTO.setOwnerType(vehicle.getOwnerType());
            vehicleSearchDTO.setStatus(vehicle.getStatus());
            vehicleSearchDTO.setRentalPrice(vehicle.getRentalPrice());
            VehicleImage thumbnail = vehicleImageRepository.findByVehicleIdAndIsThumbnailIsTrue(vehicle.getId());
            if (thumbnail != null ) {
                String base64Image = ImageUtils.encodeToBase64(thumbnail.getImageData());
                String base64WithPrefix = "data:" + thumbnail.getType() + ";base64," + base64Image;

                vehicleSearchDTO.setThumbnailImage(base64WithPrefix);
            } else {
                vehicleSearchDTO.setThumbnailImage("");
            }

            vehicleSearchDTOS.add(vehicleSearchDTO);
        }


        return vehicleSearchDTOS;
    }

    @Override
    public List<VehicleSearchDTO> findAll() {
        List<Vehicle> vehicles = vehicleRepository.findTop20ByOrderByIdAsc();
        List<VehicleSearchDTO> vehicleSearchDTOS = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            VehicleSearchDTO vehicleSearchDTO = new VehicleSearchDTO();
            vehicleSearchDTO.setId(vehicle.getId());
            vehicleSearchDTO.setName(vehicle.getName());
            vehicleSearchDTO.setBrand(vehicle.getBrand());
            vehicleSearchDTO.setType(vehicle.getType());
            vehicleSearchDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleSearchDTO.setLicensePlate(vehicle.getLicensePlate());
            vehicleSearchDTO.setOwnerType(vehicle.getOwnerType());
            vehicleSearchDTO.setStatus(vehicle.getStatus());
            vehicleSearchDTO.setRentalPrice(vehicle.getRentalPrice());
            VehicleImage thumbnail = vehicleImageRepository.findByVehicleIdAndIsThumbnailIsTrue(vehicle.getId());
            if (thumbnail != null ) {
                String base64Image = ImageUtils.encodeToBase64(thumbnail.getImageData());
                String base64WithPrefix = "data:" + thumbnail.getType() + ";base64," + base64Image;

                vehicleSearchDTO.setThumbnailImage(base64WithPrefix);
            } else {
                vehicleSearchDTO.setThumbnailImage("");
            }

            vehicleSearchDTOS.add(vehicleSearchDTO);
        }


        return vehicleSearchDTOS;
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
    public VehicleDetailDTO getVehicleToEdit(Long id) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            VehicleDetailDTO vehicleDetailDTO = new VehicleDetailDTO();
            vehicleDetailDTO.setId(vehicle.getId());
            vehicleDetailDTO.setName(vehicle.getName());
            vehicleDetailDTO.setBrand(vehicle.getBrand());
            vehicleDetailDTO.setType(vehicle.getType());
            vehicleDetailDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleDetailDTO.setLicensePlate(vehicle.getLicensePlate());
            vehicleDetailDTO.setOwnerType(vehicle.getOwnerType());
            vehicleDetailDTO.setStatus(vehicle.getStatus());
            vehicleDetailDTO.setRentalPrice(vehicle.getRentalPrice());
            vehicleDetailDTO.setSeatCount(vehicle.getSeatCount());
            vehicleDetailDTO.setVehicleCondition(vehicle.getVehicleCondition());
            vehicleDetailDTO.setDescription(vehicle.getDescription());

            List<VehicleImageDTO> imageDTOs = new ArrayList<>();
            List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
            if (vehicleImages != null) {
                for (VehicleImage image : vehicleImages) {
                    VehicleImageDTO imageDTO = new VehicleImageDTO();
                    imageDTO.setId(image.getId());
                    imageDTO.setName(image.getName());
                    imageDTO.setType(image.getType());
                    imageDTO.setIsThumbnail(image.getIsThumbnail());
                    if (image.getImageData() != null) {
                        imageDTO.setBase64Image(ImageUtils.encodeToBase64(image.getImageData()));
                    }
                    imageDTOs.add(imageDTO);
                }
            }
            vehicleDetailDTO.setVehicleImages(imageDTOs);

            return vehicleDetailDTO;
        } else {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
    }

    @Override
    public VehicleDetailDTO getVehicleToDetail(Long id) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            VehicleDetailDTO vehicleDetailDTO = new VehicleDetailDTO();
            vehicleDetailDTO.setId(vehicle.getId());
            vehicleDetailDTO.setName(vehicle.getName());
            vehicleDetailDTO.setBrand(vehicle.getBrand());
            vehicleDetailDTO.setType(vehicle.getType());
            vehicleDetailDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleDetailDTO.setDescription(vehicle.getDescription());
            vehicleDetailDTO.setLicensePlate(vehicle.getLicensePlate());
            vehicleDetailDTO.setOwnerType(vehicle.getOwnerType());
            vehicleDetailDTO.setStatus(vehicle.getStatus());
            vehicleDetailDTO.setRentalPrice(vehicle.getRentalPrice());
            vehicleDetailDTO.setSeatCount(vehicle.getSeatCount());
            vehicleDetailDTO.setVehicleCondition(vehicle.getVehicleCondition());

            List<VehicleImageDTO> imageDTOs = new ArrayList<>();
            List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
            if (vehicleImages != null) {
                for (VehicleImage image : vehicleImages) {
                    VehicleImageDTO imageDTO = new VehicleImageDTO();
                    imageDTO.setId(image.getId());
                    imageDTO.setName(image.getName());
                    imageDTO.setType(image.getType());
                    imageDTO.setIsThumbnail(image.getIsThumbnail());
                    if (image.getImageData() != null) {
                        imageDTO.setBase64Image(ImageUtils.encodeToBase64(image.getImageData()));
                    }
                    imageDTOs.add(imageDTO);
                }
            }
            vehicleDetailDTO.setVehicleImages(imageDTOs);

            return vehicleDetailDTO;
        } else {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
    }

    @Override
    public VehicleDetailDTO findVehicleToView(Long id) {
        Optional<Vehicle> optionalVehicle = vehicleRepository.findById(id);
        if (optionalVehicle.isPresent()) {
            Vehicle vehicle = optionalVehicle.get();
            VehicleDetailDTO vehicleDetailDTO = new VehicleDetailDTO();
            vehicleDetailDTO.setId(vehicle.getId());
            vehicleDetailDTO.setName(vehicle.getName());
            vehicleDetailDTO.setBrand(vehicle.getBrand());
            vehicleDetailDTO.setType(vehicle.getType());
            vehicleDetailDTO.setManufactureYear(vehicle.getManufactureYear());
            vehicleDetailDTO.setDescription(vehicle.getDescription());
            vehicleDetailDTO.setLicensePlate(vehicle.getLicensePlate());
            vehicleDetailDTO.setRentalPrice(vehicle.getRentalPrice());
            vehicleDetailDTO.setSeatCount(vehicle.getSeatCount());
            vehicleDetailDTO.setVehicleCondition(vehicle.getVehicleCondition());

            List<VehicleImageDTO> imageDTOs = new ArrayList<>();
            List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
            if (vehicleImages != null) {
                for (VehicleImage image : vehicleImages) {
                    VehicleImageDTO imageDTO = new VehicleImageDTO();
                    imageDTO.setId(image.getId());
                    imageDTO.setName(image.getName());
                    imageDTO.setType(image.getType());
                    imageDTO.setIsThumbnail(image.getIsThumbnail());
                    if (image.getImageData() != null) {
                        imageDTO.setBase64Image(ImageUtils.encodeToBase64(image.getImageData()));
                    }
                    imageDTOs.add(imageDTO);
                }
            }
            vehicleDetailDTO.setVehicleImages(imageDTOs);

            return vehicleDetailDTO;
        } else {
            throw new RuntimeException("Vehicle not found with id: " + id);
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
                existingVehicle.setStatus(vehicle.getStatus());
                existingVehicle.setDescription(vehicle.getDescription());

                if (vehicle.getVehicleImages() != null) {
                    List<VehicleImage> existingImages = existingVehicle.getVehicleImages();
                    List<VehicleImage> newImages = vehicle.getVehicleImages();
                    existingImages.removeIf(existingImage ->
                            newImages.stream().noneMatch(newImage -> newImage.getId() != null
                            && newImage.getId().equals(existingImage.getId()))
                    );
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
//                                    existingImage.setName(newImage.getName());
//                                    existingImage.setType(newImage.getType());
                                    existingImage.setIsThumbnail(newImage.getIsThumbnail());
//                                    if (newImage.getImageData() != null) {
//                                        existingImage.setImageData(ImageUtils.compressImage(newImage.getImageData()));
//                                    }
                                    break;
                                }
                            }
                        }
                    }
                }else{
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

}
