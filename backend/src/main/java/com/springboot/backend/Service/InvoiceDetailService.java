package com.springboot.backend.Service;

import com.springboot.backend.Model.InvoiceDetail;
import org.springframework.stereotype.Service;

@Service
public interface InvoiceDetailService {
    boolean createInvoiceDetail(InvoiceDetail invoiceDetail,Long employeeId);
}
