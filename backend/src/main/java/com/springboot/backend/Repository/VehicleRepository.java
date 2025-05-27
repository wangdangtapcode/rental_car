package com.springboot.backend.Repository;

import com.springboot.backend.Model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
        List<Vehicle> findFirst20ByNameContainingIgnoreCase(String name);

        List<Vehicle> findTop20ByOrderByIdAsc();

        // @Query(value = "SELECT * FROM vehicles v " +
        // "WHERE v.status = 'ACTIVE' " +
        // " ORDER BY RAND() LIMIT :count", nativeQuery = true)
        // List<Vehicle> findRandomToViewHome(@Param("count") int count);

        // // @Query(value = "SELECT * FROM vehicles v " +
        // // "WHERE v.status = 'ACTIVE' " +
        // // "AND EXISTS (SELECT 1 FROM vehicle_images vi " +
        // // "WHERE vi.vehicle_id = v.id AND vi.is_thumbnail = true)"
        // // , nativeQuery = true)
        // // List<Vehicle> findVehicleActiveAll();
        // @Query(value = "SELECT * FROM vehicles v " +
        // "WHERE v.status = 'ACTIVE' " +
        // "AND EXISTS (SELECT 1 FROM vehicle_images vi " +
        // "WHERE vi.vehicle_id = v.id AND vi.is_thumbnail = true)"
        // , nativeQuery = true)
        // List<Vehicle> findVehicleActiveAll();
        // @Query(value = "SELECT * FROM vehicles v " +
        // "WHERE v.status = 'ACTIVE' ", nativeQuery = true)
        // List<Vehicle> findVehicleActiveAll();

        @Query("SELECT DISTINCT v FROM Vehicle v " +
                        "JOIN v.contractVehicleDetails cvd " +
                        "WHERE ((cvd.startDate <= :endDate AND cvd.endDate >= :startDate) " +
                        "OR (cvd.startDate <= :endDate AND (cvd.actualReturnDate IS NULL OR cvd.actualReturnDate >= :startDate))) "
                        +
                        "AND cvd.status IN ('ACTIVE', 'BOOKING')")
        List<Vehicle> findBookedVehicles(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

        @Query("SELECT DISTINCT v FROM Vehicle v " +
                        "WHERE NOT EXISTS (" +
                        "   SELECT 1 FROM ContractVehicleDetail cvd " +
                        "   WHERE cvd.vehicle = v " +
                        "   AND cvd.status IN ('ACTIVE', 'BOOKING') " +
                        "   AND cvd.startDate <= CURRENT_DATE " +
                        "   AND (cvd.actualReturnDate IS NULL OR cvd.actualReturnDate > CURRENT_DATE)" +
                        ")")
        List<Vehicle> findCurrentlyAvailableVehicles();
}
