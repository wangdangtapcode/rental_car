package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.*;
import com.springboot.backend.Repository.EmployeeRepository;
import com.springboot.backend.Repository.InvoiceDetailRepository;
import com.springboot.backend.Repository.RentalContractRepository;
import com.springboot.backend.Repository.VehicleRepository;
import com.springboot.backend.Service.InvoiceDetailService;
import com.springboot.backend.Utils.ImageUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public boolean createInvoice(InvoiceDetail invoiceData) {
        try {
            // Tìm nhân viên
            Employee employee = employeeRepository.findById(invoiceData.getEmployee().getId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Không tìm thấy nhân viên với ID: " + invoiceData.getEmployee().getId()));

            // Lấy danh sách ID xe cần tạo hóa đơn
            List<ContractVehicleDetail> contractVehicleDetails = invoiceData.getContractVehicleDetails();
            if (contractVehicleDetails == null || contractVehicleDetails.isEmpty()) {
                throw new RuntimeException("Không có xe nào được chọn để tạo hóa đơn");
            }

            // Tạo hóa đơn mới
            InvoiceDetail invoice = new InvoiceDetail();
            invoice.setPaymentDate(invoiceData.getPaymentDate());
            invoice.setEmployee(employee);
            invoice.setPenaltyAmount(invoiceData.getPenaltyAmount());
            invoice.setTotalAmount(invoiceData.getTotalAmount());
            invoice.setDueAmount(invoiceData.getDueAmount());

            List<ContractVehicleDetail> contractVehicleDetailList = new ArrayList<>();
            RentalContract contract = rentalContractRepository
                    .findContractByVehicleDetailId(contractVehicleDetails.get(0).getId());
            if (contract == null) {
                throw new EntityNotFoundException(
                        "Không tìm thấy hợp đồng thuê xe với ID xe: " + contractVehicleDetails.get(0).getId());
            }

            // Xử lý từng xe
            for (ContractVehicleDetail contractVehicleDetail : contractVehicleDetails) {
                // Tìm chi tiết xe thuê
                ContractVehicleDetail vehicleDetail = null;
                for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                    if (detail.getId().equals(contractVehicleDetail.getId())) {
                        vehicleDetail = detail;
                        break;
                    }
                }

                if (vehicleDetail == null) {
                    throw new EntityNotFoundException(
                            "Không tìm thấy chi tiết xe thuê với ID: " + contractVehicleDetail.getId());
                }

                // Kiểm tra trạng thái xe
                if (!"ACTIVE".equals(vehicleDetail.getStatus())) {
                    throw new RuntimeException(
                            "Xe " + vehicleDetail.getVehicle().getName() + " không ở trạng thái hợp lệ để tạo hóa đơn");
                }

                // Cập nhật ngày trả thực tế
                LocalDate actualReturnDate = contractVehicleDetail.getActualReturnDate();
                vehicleDetail.setActualReturnDate(actualReturnDate);
                vehicleDetail.getPenalties().clear();
                for (Penalty penalty : contractVehicleDetail.getPenalties()) {
                    vehicleDetail.getPenalties().add(penalty);
                    penalty.setContractVehicleDetail(vehicleDetail);
                }
                // Cập nhật trạng thái xe
                vehicleDetail.setStatus("COMPLETED");
                Vehicle vehicle = vehicleDetail.getVehicle();

                vehicleRepository.save(vehicle);
                vehicleDetail.setVehicle(vehicle);

                // Thêm xe vào danh sách xe của hóa đơn
                vehicleDetail.setInvoiceDetail(invoice);

                contractVehicleDetailList.add(vehicleDetail);

                // Kiểm tra và cập nhật trạng thái hợp đồng
                boolean allCompleted = true;
                for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                    if (!"COMPLETED".equals(detail.getStatus())) {
                        allCompleted = false;
                        break;
                    }
                }

                if (allCompleted) {
                    contract.setStatus("COMPLETED");
                    rentalContractRepository.save(contract);
                }

            }



            invoice.setContractVehicleDetails(contractVehicleDetailList);
            // Lưu hóa đơn
            invoiceDetailRepository.save(invoice);

            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo hóa đơn: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

}
