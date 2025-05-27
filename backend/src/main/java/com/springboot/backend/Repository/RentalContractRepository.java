package com.springboot.backend.Repository;

import com.springboot.backend.Model.ContractVehicleDetail;
import com.springboot.backend.Model.RentalContract;
import com.springboot.backend.Model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RentalContractRepository extends JpaRepository<RentalContract, Long> {

        @Query("SELECT DISTINCT rc FROM RentalContract rc " +
                        "JOIN FETCH rc.customer c " +
                        "JOIN FETCH c.user cu " +
                        "WHERE LOWER(cu.fullName) LIKE LOWER(CONCAT('%', :customerName, '%')) " +
                        "AND rc.status = :status")
        List<RentalContract> findByCustomerNameAndStatusWithFetch(
                        @Param("customerName") String customerName,
                        @Param("status") String status);

        // Tìm hợp đồng chứa chi tiết xe với ID được chỉ định - MODIFIED TO FIX MULTIPLE
        // BAGS ISSUE
        @Query("SELECT DISTINCT rc FROM RentalContract rc " +
                        "JOIN FETCH rc.contractVehicleDetails cvd " +
                        "JOIN FETCH cvd.vehicle v " +
                        "JOIN FETCH rc.customer c " +
                        "JOIN FETCH c.user " +
                        "WHERE rc.id = (" +
                        "  SELECT rc2.id FROM RentalContract rc2 " +
                        "  JOIN rc2.contractVehicleDetails cvd2 " +
                        "  WHERE cvd2.id = :vehicleDetailId" +
                        ")")
        RentalContract findContractByVehicleDetailId(@Param("vehicleDetailId") Long vehicleDetailId);

        // New method to find vehicle images separately
        @Query("SELECT DISTINCT v FROM Vehicle v " +
                        "LEFT JOIN FETCH v.vehicleImages " +
                        "WHERE v.id = :vehicleId")
        Vehicle findVehicleWithImagesById(@Param("vehicleId") Long vehicleId);

        // Lấy hợp đồng và tất cả chi tiết xe thuê đang hoạt động - MODIFIED TO FIX
        // MULTIPLE BAGS ISSUE
        @Query("SELECT DISTINCT rc FROM RentalContract rc " +
                        "JOIN FETCH rc.contractVehicleDetails cvd " +
                        "JOIN FETCH cvd.vehicle v " +
                        "JOIN FETCH rc.customer c " +
                        "JOIN FETCH c.user " +
                        "WHERE rc.status = 'ACTIVE'")
        List<RentalContract> findAllActiveContractsWithDetails();

        // Phương thức mới tìm hợp đồng theo tên khách hàng và có ít nhất một xe đang ở
        // trạng thái ACTIVE hoặc PENDING_RETURN
         @Query("SELECT DISTINCT rc FROM RentalContract rc " +
         "JOIN FETCH rc.customer c " +
         "JOIN FETCH c.user cu " +
         "JOIN FETCH rc.contractVehicleDetails cvd " +
         "JOIN FETCH cvd.vehicle v " +
         "WHERE LOWER(cu.fullName) LIKE LOWER(CONCAT('%', :customerName, '%')) "+
         "AND (rc.status = 'ACTIVE')")
         List<RentalContract> findByCustomerNameWithActiveOrPendingVehicles(
         @Param("customerName") String customerName);
//        @Query("SELECT DISTINCT rc FROM RentalContract rc " +
//                        "JOIN FETCH rc.customer c " +
//                        "JOIN FETCH c.user cu " +
//                        "JOIN FETCH rc.contractVehicleDetails cvd " +
//                        "JOIN FETCH cvd.vehicle v " +
//                        "WHERE LOWER(cu.fullName) LIKE LOWER(CONCAT('%', :customerName, '%')) " +
//                        "AND (cvd.status = 'ACTIVE' OR cvd.status = 'PENDING_RETURN')")
//        List<RentalContract> findByCustomerNameWithActiveOrPendingVehicles(
//                        @Param("customerName") String customerName);

        @Query("SELECT cvd FROM ContractVehicleDetail cvd " +
                        "WHERE cvd.id = :contractVehicleDetailId")
        Optional<ContractVehicleDetail> findContractVehicleDetailById(
                        @Param("contractVehicleDetailId") Long contractVehicleDetailId);
}
