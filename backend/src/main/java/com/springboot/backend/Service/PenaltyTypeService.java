package com.springboot.backend.Service;

import com.springboot.backend.Model.PenaltyType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PenaltyTypeService {
    List<PenaltyType> getAll();
}
