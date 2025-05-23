package com.springboot.backend.Repository;

import com.springboot.backend.Model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle,Long> {
    List<Vehicle> findFirst20ByNameContainingIgnoreCase(String name);
    List<Vehicle> findTop20ByOrderByIdAsc();
    @Query(value = "SELECT * FROM vehicles v " +
            "WHERE v.status = 'ACTIVE' " +
            "AND EXISTS (SELECT 1 FROM vehicle_images vi " +
            "WHERE vi.vehicle_id = v.id AND vi.is_thumbnail = true)" +
            " ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Vehicle> findRandomToViewHome(@Param("count") int count);

//    @Query(value = "SELECT * FROM vehicles v " +
//            "WHERE v.status = 'ACTIVE' " +
//            "AND EXISTS (SELECT 1 FROM vehicle_images vi " +
//            "WHERE vi.vehicle_id = v.id AND vi.is_thumbnail = true)"
//            , nativeQuery = true)
//    List<Vehicle> findVehicleActiveAll();
@Query(value = "SELECT * FROM vehicles v " +
        "WHERE v.status = 'ACTIVE' "
        , nativeQuery = true)
List<Vehicle> findVehicleActiveAll();
}
