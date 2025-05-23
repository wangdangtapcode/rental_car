package com.springboot.backend.Service;

import com.springboot.backend.Model.InvoiceDetail;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface InvoiceDetailService {
//    boolean createInvoiceDetail(InvoiceDetail invoicePayload);
    
    // Tạo hóa đơn cho xe riêng lẻ
    boolean createSingleVehicleInvoice(Long contractVehicleDetailId, Long employeeId, Map<String, Object> invoiceData);
    
    // Lấy danh sách hóa đơn theo ID khách hàng
    List<InvoiceDetail> getInvoicesByCustomerId(Long customerId);
    
    // Lấy hóa đơn theo ID chi tiết xe thuê
    InvoiceDetail getInvoiceByContractVehicleDetailId(Long contractVehicleDetailId);
}
