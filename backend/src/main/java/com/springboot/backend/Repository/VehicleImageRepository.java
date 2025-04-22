package com.springboot.backend.Repository;

import com.springboot.backend.Model.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleImageRepository extends JpaRepository<VehicleImage,Long> {
    VehicleImage findByVehicleIdAndIsThumbnailIsTrue(Long vehicleId);

}
