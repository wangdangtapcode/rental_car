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
    
//    @Override
//    @Transactional
//    public boolean createInvoiceDetail(InvoiceDetail invoicePayload) {
//        try {
//            Employee employee = employeeRepository.findById(invoicePayload.getEmployee().getId())
//                    .orElseThrow(() -> new EntityNotFoundException("Employee not found with ID: " + invoicePayload.getEmployee().getId()));
//
//            invoicePayload.setEmployee(employee);
//            RentalContract rentalContract = rentalContractRepository.findById(invoicePayload.getRentalContract().getId())
//                    .orElseThrow(() -> new EntityNotFoundException("RentalContract not found with ID: " + invoicePayload.getRentalContract().getId()));
//
//            for (ContractVehicleDetail newContractVehicleDetail : invoicePayload.getRentalContract().getContractVehicleDetails()) {
//                for (ContractVehicleDetail contractVehicleDetail : rentalContract.getContractVehicleDetails()) {
//                    if (contractVehicleDetail.getId().equals(newContractVehicleDetail.getId())) {
//
//                        for (Penalty p : newContractVehicleDetail.getPenalties()) {
//                            p.setContractVehicleDetail(contractVehicleDetail);
//                            contractVehicleDetail.getPenalties().add(p);
//                        }
//                    }
//                }
//            }
//
//            rentalContract.setStatus("COMPLETED");
//
//            rentalContractRepository.save(rentalContract);
//            invoicePayload.setRentalContract(rentalContract);
//            invoiceDetailRepository.save(invoicePayload);
//            return true;
//        } catch (Exception e) {
//            // Ghi log nếu cần
//            System.err.println("Lỗi khi lưu invoiceDetail: " + e.getMessage());
//            return false;
//        }
//    }
//
    @Override
    @Transactional
    public boolean createSingleVehicleInvoice(Long contractVehicleDetailId, Long employeeId, Map<String, Object> invoiceData) {
        try {
            // Kiểm tra xem đã có hóa đơn cho xe này chưa
            InvoiceDetail existingInvoice = invoiceDetailRepository.findByContractVehicleDetailId(contractVehicleDetailId);
            if (existingInvoice != null) {
                throw new RuntimeException("Xe này đã có hóa đơn, không thể tạo thêm hóa đơn mới");
            }
            
            // Tìm chi tiết xe thuê
            RentalContract contract = rentalContractRepository.findContractByVehicleDetailId(contractVehicleDetailId);
            if (contract == null) {
                throw new EntityNotFoundException("Không tìm thấy hợp đồng thuê xe với ID xe: " + contractVehicleDetailId);
            }
            
            ContractVehicleDetail vehicleDetail = null;
            for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                if (detail.getId().equals(contractVehicleDetailId)) {
                    vehicleDetail = detail;
                    break;
                }
            }
            
            if (vehicleDetail == null) {
                throw new EntityNotFoundException("Không tìm thấy chi tiết xe thuê với ID: " + contractVehicleDetailId);
            }
            
            // Kiểm tra trạng thái xe - chấp nhận ACTIVE hoặc PENDING_RETURN
            if (!"ACTIVE".equals(vehicleDetail.getStatus()) && !"PENDING_RETURN".equals(vehicleDetail.getStatus())) {
                throw new RuntimeException("Xe này phải ở trạng thái đang thuê hoặc chờ trả để tạo hóa đơn");
            }
            
            // Tìm nhân viên
            Employee employee = employeeRepository.findById(employeeId)
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên với ID: " + employeeId));
            
            // Lấy thông tin từ dữ liệu hóa đơn
            LocalDate actualReturnDate;
            if (vehicleDetail.getActualReturnDate() != null) {
                // Nếu xe đã được kiểm tra và trả, sử dụng ngày trả thực tế đã lưu
                actualReturnDate = vehicleDetail.getActualReturnDate();
            } else {
                // Nếu không, lấy từ request
                actualReturnDate = LocalDate.parse(invoiceData.get("returnDate").toString());
                // Cập nhật ngày trả thực tế
                vehicleDetail.setActualReturnDate(actualReturnDate);
            }
            
            // Cập nhật trạng thái xe thành RETURNED vì đã thanh toán xong
            vehicleDetail.setStatus("RETURNED");
            
            float penaltyAmount = Float.parseFloat(invoiceData.getOrDefault("penaltyAmount", "0").toString());
            float additionalFees = Float.parseFloat(invoiceData.getOrDefault("additionalFees", "0").toString());
            
            // Tính tiền thuê
            LocalDate startDate = vehicleDetail.getStartDate();
            LocalDate endDate = vehicleDetail.getEndDate();
            LocalDate returnDate = actualReturnDate;
            
            long daysRented = ChronoUnit.DAYS.between(startDate, returnDate) + 1;
            float rentalPrice = vehicleDetail.getRentalPrice();
            float dueAmount = rentalPrice * daysRented;
            
            // Tính tiền phạt trả trễ (nếu có)
            if (returnDate.isAfter(endDate)) {
                long extraDays = ChronoUnit.DAYS.between(endDate, returnDate);
                float lateFee = rentalPrice * extraDays * 1.5f; // Phí trả muộn 150%
                penaltyAmount += lateFee;
            }
            
            // Cập nhật trạng thái xe trong kho - vì đã thanh toán xong
            Vehicle vehicle = vehicleDetail.getVehicle();
            vehicle.setStatus("AVAILABLE");
            vehicleRepository.save(vehicle);
            
            // Tạo hóa đơn
            InvoiceDetail invoice = new InvoiceDetail();
            invoice.setPaymentDate(LocalDate.now());
            invoice.setPenaltyAmount(penaltyAmount + additionalFees);
            invoice.setDueAmount(dueAmount);
            invoice.setTotalAmount(dueAmount + penaltyAmount + additionalFees);
            invoice.setEmployee(employee);
            invoice.setContractVehicleDetail(vehicleDetail);
            
            // Lưu hóa đơn
            invoiceDetailRepository.save(invoice);
            
            // Kiểm tra xem còn xe đang thuê không
            boolean allReturned = true;
            for (ContractVehicleDetail detail : contract.getContractVehicleDetails()) {
                if (!"RETURNED".equals(detail.getStatus())) {
                    allReturned = false;
                    break;
                }
            }
            
            // Nếu tất cả xe đã trả, cập nhật trạng thái hợp đồng
            if (allReturned) {
                contract.setStatus("COMPLETED");
                rentalContractRepository.save(contract);
            }
            
            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo hóa đơn cho xe: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
    
    @Override
    public List<InvoiceDetail> getInvoicesByCustomerId(Long customerId) {
        try {
            List<InvoiceDetail> invoices = invoiceDetailRepository.findByCustomerId(customerId);
            
            // Xử lý hình ảnh xe nếu cần
            for (InvoiceDetail invoice : invoices) {
                ContractVehicleDetail detail = invoice.getContractVehicleDetail();
                if (detail != null && detail.getVehicle() != null && detail.getVehicle().getVehicleImages() != null) {
                    for (VehicleImage image : detail.getVehicle().getVehicleImages()) {
                        if (image.getImageData() != null) {
                            String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                            String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                            image.setImageData(null);
                            image.setImageUri(imageUri);
                        }
                    }
                }
            }
            
            return invoices;
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy hóa đơn theo khách hàng: " + e.getMessage());
            return new ArrayList<>();
        }
    }
    
    @Override
    public InvoiceDetail getInvoiceByContractVehicleDetailId(Long contractVehicleDetailId) {
        try {
            InvoiceDetail invoice = invoiceDetailRepository.findByContractVehicleDetailId(contractVehicleDetailId);
            
            if (invoice != null) {
                // Xử lý hình ảnh xe nếu cần
                ContractVehicleDetail detail = invoice.getContractVehicleDetail();
                if (detail != null && detail.getVehicle() != null && detail.getVehicle().getVehicleImages() != null) {
                    for (VehicleImage image : detail.getVehicle().getVehicleImages()) {
                        if (image.getImageData() != null) {
                            String imgBase64 = ImageUtils.encodeToBase64(image.getImageData());
                            String imageUri = "data:" + image.getType() + ";base64," + imgBase64;
                            image.setImageData(null);
                            image.setImageUri(imageUri);
                        }
                    }
                }
            }
            
            return invoice;
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy hóa đơn theo ID xe thuê: " + e.getMessage());
            return null;
        }
    }
}
