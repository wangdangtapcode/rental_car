package com.springboot.backend.Service;

import com.springboot.backend.Model.Collateral;
import com.springboot.backend.Model.ContractVehicleDetail;
import com.springboot.backend.Model.RentalContract;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@Service
public interface RentalContractService {
    boolean createRentalContract(RentalContract rentalContract);

    boolean updateContract(RentalContract rentalContract);

    List<RentalContract> getContractBookingByFullNameCustomer(String name);

    List<RentalContract> getContractActiveByFullNameCustomer(String name);

    // Thêm phương thức mới để trả xe riêng lẻ
    boolean returnVehicle(Long contractVehicleDetailId, Long employeeId, LocalDate returnDate,
            List<Map<String, Object>> penalties);

    // Phương thức lấy thông tin chi tiết xe đang thuê
    ContractVehicleDetail getContractVehicleDetail(Long id);

    // Phương thức lấy danh sách xe đang thuê của một hợp đồng
    List<ContractVehicleDetail> getActiveVehiclesForContract(Long contractId);
}
