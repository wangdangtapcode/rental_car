package com.springboot.backend.Service;

import com.springboot.backend.Model.Collateral;
import com.springboot.backend.Model.ContractVehicleDetail;
import com.springboot.backend.Model.RentalContract;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface RentalContractService {
    boolean createRentalContract(RentalContract rentalContract);
    boolean updateContract(
            Long employeeId,
            Long rentalContractId,
            List<Map<String, Object>> updatedVehicleConditions
    );
    List<RentalContract> getContractBookingByFullNameCustomer(String name);
    List<RentalContract> getContractActiveByFullNameCustomer(String name);
}


