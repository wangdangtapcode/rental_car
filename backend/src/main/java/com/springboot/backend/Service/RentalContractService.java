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

}
