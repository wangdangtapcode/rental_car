package com.springboot.backend.Controller;

import com.springboot.backend.Model.PenaltyType;
import com.springboot.backend.Model.RentalContract;
import com.springboot.backend.Service.PenaltyTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PenaltyTypeController {
    @Autowired
    private final PenaltyTypeService penaltyTypeService;

    @GetMapping(value = "/api/penalty-types/all")
    public List<PenaltyType> getAll(){
        return penaltyTypeService.getAll();
    }
}
