package com.springboot.backend.Service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface RentalContractService {
    boolean createRentalContract(
            Long customerId,
            Long employeeId,
            String startDate,
            String endDate,
            Float depositAmount,
            List<Map<String, Object>> contractVehicleDetails,
            List<Map<String, Object>> collaterals
            );
}


