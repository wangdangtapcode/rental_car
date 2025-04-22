package com.springboot.backend.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.backend.DTO.CustomerDTO;
import com.springboot.backend.DTO.VehicleDetailDTO;
import com.springboot.backend.DTO.VehicleSearchDTO;
import com.springboot.backend.Model.Vehicle;
import com.springboot.backend.Model.VehicleImage;
import com.springboot.backend.Service.VehicleService;
import com.springboot.backend.Utils.ImageUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping(value = "/api/vehicle/random/{count}")
    public List<VehicleSearchDTO> findToViewHome(@PathVariable int count) {
        return vehicleService.findToViewHome(count);
    }
    @GetMapping(value = "/api/vehicle/all")
    public List<VehicleSearchDTO> findToViewHome() {
        return vehicleService.findViewAll();
    }
    @GetMapping(value = "/api/vehicle/view/{id}")
    public VehicleDetailDTO findVehicleToView(@PathVariable Long id) {
        return vehicleService.findVehicleToView(id);
    }
    @GetMapping(value = "/api/management/vehicle/search")
    public List<VehicleSearchDTO> findByName(@RequestParam String name){
        return vehicleService.findByName(name);
    }

    @GetMapping(value = "/api/management/vehicle/search/all")
    public List<VehicleSearchDTO> findAll(){
        return vehicleService.findAll();
    }

    @PostMapping(value = "/api/management/vehicle/add",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean CreateVehicle(
            @RequestParam("vehicle") String vehicleJson,
            @RequestParam(value = "vehicleImages", required = false) List<MultipartFile> imageFiles
    )throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Vehicle vehicle = objectMapper.readValue(vehicleJson, Vehicle.class);

        List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
        if (imageFiles != null && vehicleImages != null && imageFiles.size() == vehicleImages.size()) {
            for (int i = 0; i < imageFiles.size(); i++) {
                VehicleImage vehicleImage = vehicleImages.get(i);
                vehicleImage.setImageData(imageFiles.get(i).getBytes());
                vehicleImage.setVehicle(vehicle);
            }
        } else if (imageFiles != null && vehicleImages != null && imageFiles.size() != vehicleImages.size()) {
            return false;
        }

        return vehicleService.createVehicle(vehicle);
    }
    @GetMapping(value = "/api/management/vehicle/edit/{id}")
    public VehicleDetailDTO getVehicleToEdit(@PathVariable("id") Long id){
    return vehicleService.getVehicleToEdit(id);
    }
    @PostMapping(value = "/api/management/vehicle/edit/{id}",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public boolean EditVehicle(
            @PathVariable("id") Long id,
            @RequestParam("vehicle") String vehicleJson,
            @RequestParam(value = "vehicleImages", required = false) List<MultipartFile> imageFiles
    )throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Vehicle vehicle = objectMapper.readValue(vehicleJson, Vehicle.class);

        List<VehicleImage> vehicleImages = vehicle.getVehicleImages();
        if (vehicleImages != null) {
            int imageFileIndex = 0;

            for (VehicleImage img : vehicleImages) {
                // Luôn set lại mối quan hệ
                img.setVehicle(vehicle);

                // Ảnh mới → không có id
                if (img.getId() == null && imageFiles != null && imageFileIndex < imageFiles.size()) {
                    MultipartFile file = imageFiles.get(imageFileIndex);
                    img.setImageData(file.getBytes());
                    imageFileIndex++;
                }

            }

            // Kiểm tra số ảnh mới và file upload có khớp không
            if (imageFiles != null && imageFileIndex != imageFiles.size()) {
                return false; // dữ liệu không khớp → trả lỗi
            }
        }

        return vehicleService.editVehicle(id,vehicle);
    }
    @GetMapping(value = "/api/management/vehicle/detail/{id}")
    public VehicleDetailDTO getVehicleToDetail(@PathVariable Long id){
        return vehicleService.getVehicleToDetail(id);
    }
    @DeleteMapping(value = "/api/management/vehicle/del/{id}")
    public boolean DeleteVehicle(@PathVariable Long id){
        return vehicleService.deleteVehicle(id);
    }

}
