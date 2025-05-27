package com.springboot.backend.Service;

import com.springboot.backend.Model.InvoiceDetail;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface InvoiceDetailService {

    boolean createInvoice(InvoiceDetail invoiceData);

}
