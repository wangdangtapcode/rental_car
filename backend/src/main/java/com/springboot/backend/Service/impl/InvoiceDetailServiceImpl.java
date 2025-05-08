package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.*;
import com.springboot.backend.Repository.EmployeeRepository;
import com.springboot.backend.Repository.InvoiceDetailRepository;
import com.springboot.backend.Repository.RentalContractRepository;
import com.springboot.backend.Repository.VehicleRepository;
import com.springboot.backend.Service.InvoiceDetailService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class InvoiceDetailServiceImpl implements InvoiceDetailService {
    @Autowired
    private final InvoiceDetailRepository invoiceDetailRepository;
    @Autowired
    private final EmployeeRepository employeeRepository;
    @Autowired
    private final RentalContractRepository rentalContractRepository;
    @Autowired
    private final VehicleRepository vehicleRepository;
    @Override
    @Transactional
    public boolean createInvoiceDetail(InvoiceDetail invoiceDetail, Long employeeId) {
        try {
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + employeeId));

            invoiceDetail.setEmployee(employee);

            RentalContract rentalContract = invoiceDetail.getRentalContract();
            rentalContract.setStatus("COMPLETED");

            rentalContractRepository.save(rentalContract);
            List<ContractVehicleDetail> details = rentalContract.getContractVehicleDetails();
            for (ContractVehicleDetail detail : details) {
                Vehicle vehicle = detail.getVehicle();
                vehicle.setStatus("ACTIVE");
                vehicleRepository.save(vehicle);
            }

            invoiceDetailRepository.save(invoiceDetail);
            return true;
        } catch (Exception e) {
            // Ghi log nếu cần
            System.err.println("Lỗi khi lưu invoiceDetail: " + e.getMessage());
            return false;
        }
    }
}
