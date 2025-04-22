package com.springboot.backend.Repository;

import com.springboot.backend.DTO.CustomerInvoiceDetail;
import com.springboot.backend.DTO.CustomerRevenue;
import com.springboot.backend.Model.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail,Long> {
    @Query(value = """
    SELECT 
        u.id AS userId,
        u.full_name AS fullName,
        u.address AS address,
        u.phone_number AS phoneNumber,
        COUNT(rc.id) AS totalContracts,
        SUM(DATEDIFF(rc.end_date, rc.start_date)) AS totalRentalDays,
        SUM(i.total_amount) AS totalRevenue
    FROM rental_contracts rc
    JOIN customers c ON rc.customer_id = c.user_id
    JOIN users u ON c.user_id = u.id
    JOIN invoice_details i ON i.rental_contract_id = rc.id
    WHERE i.payment_date BETWEEN :startDate AND :endDate
    GROUP BY u.id, u.full_name, u.address, u.phone_number
    ORDER BY totalRevenue DESC
""", nativeQuery = true)
    List<Object[]> getCustomerRevenueBetweenNative(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = """
    SELECT 
        i.id AS invoiceId,
        rc.start_date AS startDate,
        rc.end_date AS endDate,
        i.payment_date AS paymentDate,
        (
            SELECT COUNT(*) 
            FROM contract_vehicle_details d 
            WHERE d.rental_contract_id = rc.id
        ) AS vehicleCount,
        (i.total_amount - i.penalty_amount) AS amountExcludingPenalty,
        i.penalty_amount AS penaltyAmount,
        i.total_amount AS totalAmount
    FROM invoice_details i
    JOIN rental_contracts rc ON i.rental_contract_id = rc.id
    JOIN customers c ON rc.customer_id = c.user_id
    JOIN users u ON c.user_id = u.id
    WHERE u.id = :customerId
      AND i.payment_date BETWEEN :startDate AND :endDate
    ORDER BY i.payment_date ASC
""", nativeQuery = true)
    List<Object[]> getInvoicesForCustomerInPeriodNative(
            @Param("customerId") Long customerId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}
