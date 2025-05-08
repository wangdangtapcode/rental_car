package com.springboot.backend.Service;

import com.springboot.backend.Model.RentalContract;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface RentalContractService {
    boolean createRentalContract(
            Long customerId,
            Long employeeId,
            RentalContract rentalContract,
            List<Map<String, Object>> contractVehicleDetails,
            List<Map<String, Object>> collaterals
            );
    List<RentalContract> getContractBookingByFullNameCustomer(String name);
    List<RentalContract> getContractActiveByFullNameCustomer(String name);
}


